const svg = d3.select("#court");

const width = 928;
const height = 500;
const marginTop = 20;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 50;


const COURT = {
  width: 94,
  height: 50,
  keyTop: 33,
  keyLength: 19,
  keyWidth: 16,
  circleRadius: 6,
  threePointRadius: 23.75,
  threePointLineLength: 14,
  threePointLineDist: 3,
  hoopDistance: 4,
  hoopDiameter: 1.5,
  restrictedRadius: 4.25,
  courtMargin: 3   
};

COURT.hoopX = COURT.hoopDistance + COURT.hoopDiameter / 2;
COURT.hoopY = COURT.height / 2;
COURT.cornerDist = COURT.height / 2 - COURT.threePointLineDist;
COURT.angle = Math.asin(COURT.cornerDist / COURT.threePointRadius);

const xScale = d3.scaleLinear()
    .domain([0, COURT.width])
    .range([marginLeft, width - marginRight]);

const yScale = d3.scaleLinear()
    .domain([0, COURT.height])
    .range([height - marginBottom, marginTop]);

function drawShots(filters) {
        svg.selectAll("circle.shot").remove();
        const params = new URLSearchParams(filters);
        d3.json(`/player_shots/?${params.toString()}`)
          .then(data => {
              data.forEach(d => {
                  const locXFeet = d.LOC_X / 10;
                  const locYFeet = d.LOC_Y / 10;

                  const courtX = COURT.hoopX + locYFeet;
                  const courtY = COURT.hoopY - locXFeet;

                  d.x = xScale(courtX);
                  d.y = yScale(courtY);
              });

              svg.selectAll("circle.shot")
                  .data(data)
                  .enter()
                  .append("circle")
                  .attr("class", "shot")
                  .attr("cx", d => d.x)
                  .attr("cy", d => d.y)
                  .attr("r", 0)
                  .attr("fill", d => d.SHOT_MADE_FLAG ? "green" : "red")
                  .attr("opacity", 0.7)
                  .transition()
                  .duration(300)
                  .delay((d, i) => i * 5)
                  .attr("r", 3);
          });
    }

document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("load");

    button.addEventListener("click", () => {

        const filters = {
            name: document.getElementById("player-name").value.trim(),
            season_start: document.getElementById("season-start").value.trim(),
            season_end: document.getElementById("season-end").value.trim(),
            season_type: document.getElementById("season-type").value,
            opponent: document.getElementById("opponent").value.trim()
        };

        drawShots(filters);
    });

});
