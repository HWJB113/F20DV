//create the svg using values defined in the html file.
const svg = d3.select("svg"),
    width = svg.attr("width") ,
    height = svg.attr("height");

// create the projection value for the map, centring it in a place where all countries can be seen 
const projection = d3.geoMercator()
    .scale(width / 2.5 / Math.PI)
    .rotate([0, 0])
    .center([0, 0])
    .translate([width / 2, height / 2]);


 let filtered;
 let all;

var lwidth = 500;
var lheight = 500 ;

var lsvg = d3.select('#line')
.append("svg")
    .attr("width", lwidth )
    .attr("height", lheight )
  .append("g")
    .attr("transform",
          "translate(" + 50 + "," + (-10) + ")");

//create a scale for the number of deaths to change the colour of the country
let colorScale = d3.scaleThreshold()
  .domain([10000, 100000, 1000000, 2000000, 3000000, 10000000])
  .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]);

//create a map for the data to be paired together
let data = new Map()
// Load using a promise to ensure that both steps are completed before the .then happens
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv", (function(d){

    //when loading the csv data only get the most recent deaths
    if(d.date == "2022-03-23"){
        data.set(d.iso_code, +d.total_deaths)
    }

}),
)
]).then(function(loading){
    //using topological ddata gathered from another source
    let mapInformation = loading[0]
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(mapInformation.features)
        
        .join("path")
            .attr("fill", function (d) {
              //gets the scale of the colour
                return colorScale(data.get(d.id));
            })
            //actually creates the map path using the provided projection, in this case mercator
            .attr("d", d3.geoPath()
            .projection(projection)
            )
            .style("stroke", "white")
            .attr("id", function(d){
                return d.id;
            })
            //highlight the selected country, and change the line graph attributes to be red 
        .on('mouseover', function (d) {
            d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 1)

            d3.select("#line")
            .style("stroke", "red")
           
        })
        //unhighlight the country and change the line grpah to blue instead
        .on('mouseout', function (d) {
            d3.select(this)
            .style("stroke", "white")

            d3.select("#line")
            .style("stroke", "steelblue")
        })
})


d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv", 
function(d){
  return { date : d3.timeParse("%Y-%m-%d")(d.date), deaths : d.total_deaths, iso: d.iso_code};
}).then(function(data){
  filterLine(data, "RUS")
})

//filters the entire csv data set for a specific country 
function filterData(filter, country){
  all = filter
  return filter.filter(function (d){ return d.iso == country })
}


//attempts to modularise the code, but JS would break and say values undefined before the function was called
function filterLine(all, country){

//filters the data to only include the needed country
 filtered =  filterData(all, country)


  var x = d3.scaleTime()
  .domain(d3.extent(all, function(d) { return d.date; }))
  .range([ 0, lwidth ]);
lsvg.append("g")
  .attr("transform", "translate(0," + lheight + ")")
  .call(d3.axisTop(x));

// Add the y axis, scaling for the maximum value of number of deaths from the filtered dataset. 
//0 - maximum using the whole height of the svg
var y = d3.scaleLinear()
  .domain([0, d3.max(filtered, function(d) { return d.deaths; })])
  .range([ lheight, 0 ]);
lsvg.append("g")
  .call(d3.axisLeft(y));
// Add the line, using the filtered data.
// using d3.line to draw the line from the indeividual data points
//calucating the place to draw each from the x and y scales
lsvg.append("path")
  .datum(filtered)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("d", d3.line()
      .x(function(d) {
        return x(d.date) })
      .y(function(d) { return y(d.deaths) })
      )

    //chage the line colour to red and hightight RUSSIA on the map
    .on("mouseover", function(d){
        d3.select(this)
        .attr("stroke", "red")
        d3.select("#RUS")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("cursor", "pointer");

    })
    //unhighlight russia and turn the line back to its original colour
    .on("mouseout", function(d){
      d3.select("#RUS")
      .style("stroke", "white")
      d3.select(this)
      .attr("stroke", "orange")


    })

}
