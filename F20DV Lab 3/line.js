// The svg
const svg = d3.select("svg"),
    width = +svg.attr("width") ,
    height = +svg.attr("height");

// Map and projection
const projection = d3.geoMercator()
    .scale(width / 2.5 / Math.PI)
    .rotate([0, 0])
    .center([0, 0])
    .translate([width / 2, height / 2]);

const colorScale = d3.scaleThreshold()
  .domain([10000, 100000, 1000000, 3000000, 8000000, 10000000])
  .range(d3.schemeReds[7]);
let data = new Map()
// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv", (function(d){
    //console.log(d.date)
    if(d.date == "2022-03-23"){
        console.log(d.iso_code)
        data.set(d.iso_code, +d.total_deaths)
    }

    var x = d3.scaleTime()
      .domain(d3.extent(d.date))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 3000000])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(d)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(f) { return x(f.date) })
        .y(function(f) { return y(f.total_cases) })
        )


}),
)
]).then(function(loading){

    let topo = loading[0]
    //console.log(data.get("AFG"))
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        
        .join("path")
            .attr("fill", function (d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            })
            .attr("d", d3.geoPath()
            .projection(projection)
            )
            .style("stroke", "#fff")
            .attr("id", function(d){
                return d.id;
            })
        .on('mouseover', function (d) {
            d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("cursor", "pointer");
           
        })
        .on('mouseout', function (d) {
            d3.select(this)
            .style("stroke", "white")
        })
})
