from flask import Flask, jsonify, render_template, request
from nba_api.stats.endpoints import shotchartdetail
from nba_api.stats.static import players, teams

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/player_shots/")
def player_shots():
    name = request.args.get("name", "")
    season_start = request.args.get("season_start", "")
    season_end = request.args.get("season_end", "")
    season_type = request.args.get("season_type", "Regular Season")
    opponent_param = request.args.get("opponents", "")

    if not name or not season_start or not season_end:
        return jsonify({"error": "Must provide player name and season start/end"}), 400

    matches = players.find_players_by_full_name(name)
    if not matches:
        return jsonify({"error": "Player not found"}), 404

    player_id = matches[0]["id"]

    def season_range(start, end):
        start_year = int(start.split("-")[0])
        end_year = int(end.split("-")[0])
        seasons = []
        for y in range(start_year, end_year + 1):
            seasons.append(f"{y}-{str(y+1)[2:]}")
        return seasons

    seasons = season_range(season_start, season_end)

    opponent_ids = []
    if opponent_param:
        abbreviations = [abbr.strip().upper() for abbr in opponent_param.split(",")]
        for abbr in abbreviations:
            team = next((t for t in teams.get_teams() if t["abbreviation"] == abbr), None)
            if team:
                opponent_ids.append(team["id"])

    season_types = ["Regular Season", "Playoffs"] if season_type == "Both" else [season_type]

    all_shots = []

    for season in seasons:
        for stype in season_types:
            if opponent_ids:
                for opp_id in opponent_ids:
                    chart = shotchartdetail.ShotChartDetail(
                        team_id=0,
                        player_id=player_id,
                        season_nullable=season,
                        season_type_all_star=stype,
                        opponent_team_id=opp_id,
                        context_measure_simple="FGA",
                        timeout=90  
                    )
                    df = chart.get_data_frames()[0]
                    all_shots.extend(
                        df[["LOC_X", "LOC_Y", "SHOT_MADE_FLAG", "SHOT_DISTANCE"]].to_dict(orient="records")
                    )
            else:
                chart = shotchartdetail.ShotChartDetail(
                    team_id=0,
                    player_id=player_id,
                    season_nullable=season,
                    season_type_all_star=stype,
                    context_measure_simple="FGA",
                    timeout=90 
                )
                df = chart.get_data_frames()[0]
                all_shots.extend(
                    df[["LOC_X", "LOC_Y", "SHOT_MADE_FLAG", "SHOT_DISTANCE"]].to_dict(orient="records")
                )

    return jsonify(all_shots)


if __name__ == "__main__":
    app.run(debug=True)