const randMax = 120;

const randNum = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

// this is the actual lesson content
// Source is the first node
// Target is the second node
// type is the kind of connector between nodes
const links = [
  {source: "A", target: "B", type: "licensing"},
  {source: "A", target: "C", type: "licensing"},
  {source: "A", target: "D", type: "licensing"},
  {source: "B", target: "E", type: "licensing"},
  {source: "B", target: "F", type: "licensing"},
  {source: "B", target: "G", type: "licensing"},
  {source: "G", target: "H", type: "licensing"},
  {source: "G", target: "I", type: "licensing"},
  {source: "G", target: "J", type: "licensing"},
  {source: "D", target: "M", type: "licensing"},
  {source: "D", target: "L", type: "licensing"},
  {source: "D", target: "K", type: "licensing"},
  {source: "C", target: "N", type: "licensing"},
  {source: "C", target: "O", type: "licensing"},
  {source: "C", target: "P", type: "licensing"},
  {source: "P", target: "Q", type: "licensing"}
];

// defines nodes as a global object.
const nodes = {};

// Compute the distinct nodes from the links. Looks at each object on the array and creates it.
// FEATURE: Would like to pin the very first element in the array [0] as the center of the tree.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

// I believe this is the screen height and width. I'm defining the "svg" here, but it starts in the top left corner. Can I move that to where I want it on the tree with CSS?
const width = 960,
    height = 500;

const force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(randNum(randMax))
    .charge(-300)
    .on("tick", tick)
    .start();

// svg gets invented inside of body here. So if I want to put this inside another div, I need to append svg inside of that.
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Per-type markers, as they don't inherit styles.
// this is the thing that calculates the link arc style... I think. Yeah, this can be reduced to simpler code, or I could only use one style of the below code so I don't have alter the code here.
svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10") // this is how big the screen is? How is this different than the width/height above?
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");

const path = svg.append("g").selectAll("path")
    .data(force.links())
  .enter().append("path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

const circle = svg.append("g").selectAll("circle")
    .data(force.nodes())
  .enter().append("circle")
    .attr("r", 25) // 6
    .call(force.drag);

// const text = svg.append("g").selectAll("text")
//     .data(force.nodes())
//   .enter().append("text")
//     .attr("x", 8)
//     .attr("y", ".31em")
//     .text(function(d) { return d.name; });

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  // text.attr("transform", transform);
}

function linkArc(d) {
  const dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}
