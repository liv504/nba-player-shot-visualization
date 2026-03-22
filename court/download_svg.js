// get the SVG element
const svgNode = svg.node();

// serialize it to a string
const serializer = new XMLSerializer();
const svgString = serializer.serializeToString(svgNode);

// download as file
const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
const url = URL.createObjectURL(blob);

const link = document.createElement("a");
link.href = url;
link.download = "nba_court.svg";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
URL.revokeObjectURL(url);