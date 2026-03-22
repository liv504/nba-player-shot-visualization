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


const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const court = svg.append("g").attr("class", "court");

court.append("rect")
    .attr("x", xScale(0 - COURT.courtMargin))                 
    .attr("y", yScale(COURT.height + COURT.courtMargin))    
    .attr("width", xScale(COURT.width + COURT.courtMargin) - xScale(0 - COURT.courtMargin)) 
    .attr("height", yScale(0 - COURT.courtMargin) - yScale(COURT.height + COURT.courtMargin)) 
    .attr("fill", "#dfbb85")
    .attr("stroke", "none")
    .attr("stroke-width", 2);

court.append("rect")
    .attr("x", xScale(0))
    .attr("y", yScale(COURT.height))
    .attr("width", xScale(COURT.width) - xScale(0))
    .attr("height", yScale(0) - yScale(COURT.height))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 2);

const leftHalf = court.append("g");


//half-court line
leftHalf.append("line")
    .attr("x1", xScale(COURT.width / 2))
    .attr("y1", yScale(0))
    .attr("x2", xScale(COURT.width / 2))
    .attr("y2", yScale(COURT.height))
    .attr("stroke", "white")
    .attr("stroke-width", 2);

//center circle
leftHalf.append("circle")
    .attr("cx", xScale(COURT.width / 2))
    .attr("cy", yScale(COURT.height / 2))
    .attr("r", xScale(COURT.circleRadius) - xScale(0))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 2);   

//key
leftHalf.append("rect")
  .attr("x", xScale(0))
  .attr("y", yScale(COURT.keyTop))
  .attr("width", xScale(COURT.keyLength) - xScale(0))
  .attr("height", yScale(0) - yScale(COURT.keyWidth))
  .attr("fill", "#981717")
  .attr("stroke", "white")
  .attr("stroke-width", 2);

//key circle
leftHalf.append("path")
    .attr("transform", "translate("+ xScale(COURT.keyLength) + "," + yScale(COURT.height/2) + ")")
    .attr("d", d3.arc()({
        innerRadius: xScale(COURT.circleRadius) - xScale(0),
        outerRadius: xScale(COURT.circleRadius) - xScale(0),
        startAngle: 0,
        endAngle: Math.PI
    }))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 2);

//key dashed-circle
leftHalf.append("path")
    .attr("transform", "translate("+ xScale(COURT.keyLength) + "," + yScale(COURT.height/2) + ")")
    .attr("d", d3.arc()({
        innerRadius: xScale(COURT.circleRadius) - xScale(0),
        outerRadius: xScale(COURT.circleRadius) - xScale(0),
        startAngle: 0,
        endAngle: - Math.PI
    }))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-dasharray", "4 4")
    .attr("stroke-width", 2);

//hoop
leftHalf.append("circle")
  .attr("cx", xScale(COURT.hoopX))
  .attr("cy", yScale(COURT.hoopY))
  .attr("r", (xScale(COURT.hoopDiameter) - xScale(0)) / 2)
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 2);

//backboard
leftHalf.append("line")
    .attr("x1", xScale(COURT.hoopX - COURT.hoopDiameter / 2 - 0.5))
    .attr("y1", yScale(COURT.hoopY - COURT.restrictedRadius + 0.5))
    .attr("x2", xScale(COURT.hoopX - COURT.hoopDiameter / 2 - 0.5))
    .attr("y2", yScale(COURT.hoopY + COURT.restrictedRadius - 0.5))
    .attr("stroke", "white")
    .attr("stroke-width", 2);

//restriced area arc
leftHalf.append("path")
  .attr(
    "transform",
    `translate(${xScale(COURT.hoopX)}, ${yScale(COURT.hoopY)})`
  )
  .attr(
    "d",
    d3.arc()({
      innerRadius: xScale(COURT.restrictedRadius) - xScale(0),
      outerRadius: xScale(COURT.restrictedRadius) - xScale(0),
      startAngle: 0,
      endAngle: Math.PI
    })
  )
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 2);

//three-point arc

leftHalf.append("path")
  .attr(
    "transform",
    `translate(${xScale(COURT.hoopX)}, ${yScale(COURT.hoopY)})`
  )
  .attr(
    "d",
    d3.arc()({
      innerRadius: xScale(COURT.threePointRadius) - xScale(0),
      outerRadius: xScale(COURT.threePointRadius) - xScale(0),
      startAngle: Math.PI/2 - COURT.angle,
      endAngle: Math.PI/2 + COURT.angle
    })
  )
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 2);

//three-point lines
leftHalf.append("line")
    .attr("x1", xScale(0))
    .attr("y1", yScale(COURT.height - COURT.threePointLineDist))
    .attr("x2", xScale(COURT.threePointLineLength))
    .attr("y2", yScale(COURT.height - COURT.threePointLineDist))
    .attr("stroke", "white")
    .attr("stroke-width", 2);

leftHalf.append("line")
    .attr("x1", xScale(0))
    .attr("y1", yScale(COURT.threePointLineDist))
    .attr("x2", xScale(COURT.threePointLineLength))
    .attr("y2", yScale(COURT.threePointLineDist))
    .attr("stroke", "white")
    .attr("stroke-width", 2);

const rightHalf = leftHalf.clone(true);

rightHalf
  .attr("transform", `translate(${xScale(COURT.width) + marginLeft},0) scale(-1,1)`);

court.node().appendChild(rightHalf.node());


d3.json("/player_shots/201939").then(data => {
    data.forEach(d => {
        d.x = +d.x;
        d.y = +d.y;    
    })

    svg.selectAll(".shot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "shot")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 3)
        .attr("fill", d => d.shot_made_flag === 1 ? "green" : "red")
        .attr("opacity", 0.7);
})

