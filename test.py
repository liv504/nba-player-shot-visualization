from nba_api.stats.endpoints import shotchartdetail
from flask import Flask, jsonify, render_template, request
from nba_api.stats.endpoints import shotchartdetail
from nba_api.stats.static import players, teams


player_id = 201939  
season = "2022-23"   

shotchart = shotchartdetail.ShotChartDetail(
    team_id=0,                   
    player_id=player_id,
    season_nullable=season,
    season_type_all_star="Regular Season",
    location_nullable="Home",
    context_measure_simple="FGA"
)

df = shotchart.get_data_frames()[0]
print(df.head())
