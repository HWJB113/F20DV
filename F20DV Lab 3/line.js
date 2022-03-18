 var svg = d3.select("svg");
 svg.attr("width", Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
 svg.attr("height", Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
  var margin = 200;
  var width = svg.attr("width") - margin;
  var height = svg.attr("height") - margin;
  //import the csv file from my personal github
  var csv = "https://raw.githubusercontent.com/HWJB113/F20DV/gh-pages/Lab2/stock.csv";
  var csv2 = "https://raw.githubusercontent.com/HWJB113/F20DV/gh-pages/vaccinations.csv";
  svg.append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "50px")
    .text("Stock Price")
  var x = d3.scaleBand().range([0, width]).padding(0.4);
  var y = d3.scaleLinear().range([height, 0]);
  var g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");
      
    d3.csv( csv2 )
    .then(function(data) {
      x.domain( data.map(function(d, i) { 
        if(d.date == "2022-03-13" && d.total_vaccinations >0 ){
          console.log(d.date)
          console.log(d.iso_code)
          console.log("vaccinations = " +d.total_vaccinations)
        return d.iso_code; }}));
        console.log(function(d){return d.iso_code;})
      console.log(d3.max(data, function(d) { return d.total_vaccinations; }))
      y.domain([0, 11004089103]);
      g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("y", height - 400)
      .attr("x", width - 100)
      .attr("text-anchor", "end")
      .attr("stroke", "red")
      .text("Country Code");
      g.append("g")
      .call(d3.axisLeft(y).tickFormat(function(d){
      return d;
      }).ticks(10))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-5.1em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Stock Price");
      g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .filter(function(d){ return d.date < "2022-03-13"})
      .attr("fill", "red")
      .attr("class", "bar")
      // .on(….. ) – call mouse events here…
      //.on("mouseover", onMouseOver)
      //.on("mouseout", onMouseOut)
      .attr("x", function(d) { return x(d.iso_code); })
      .attr("y", function(d) { return y(d.total_vaccinations); })
      .attr("width", x.bandwidth())
      .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .delay(function (d, i) {
      return 1000;
      })
      .attr("height", function(d) { return height - y(d.total_vaccinations); })
     });

     var color = d3.scaleThreshold()
     .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
     .range(["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]);

     var mapsvg = d3.select("body")
     .append("svg")
     .style("cursor", "move");
     mapsvg.attr("viewBox", "50 10 " + width + " " + height)
     .attr("preserveAspectRatio", "xMinYMin");
 
    var zoom = d3.zoom()
     .on("zoom", function () {
         var transform = d3.zoomTransform(this);
         map.attr("transform", transform);
     });
 
    mapsvg.call(zoom);
     var map = mapsvg.append("g")
    .attr("class", "map");
    d3.queue()
    .defer(d3.json, "50m.json")
    .defer(d3.json, "population.json")
    .await(function (error, world, data) {
        if (error) {
            console.error('Oh dear, something went wrong: ' + error);
        }
        else {
            drawMap(world, data);
        }
    });

function drawMap(world, data) {
    // geoMercator projection
    var projection = d3.geoMercator() //d3.geoOrthographic()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    // geoPath projection
    var path = d3.geoPath().projection(projection);

    //colors for population metrics
    var color = d3.scaleThreshold()
        .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
        .range(["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]);

    var features = topojson.feature(world, world.objects.countries).features;
    var populationById = {};

    data.forEach(function (d) {
        populationById[d.country] = {
            total: +d.total,
            females: +d.females,
            males: +d.males
        }
    });
    features.forEach(function (d) {
        d.details = populationById[d.properties.name] ? populationById[d.properties.name] : {};
    });

    map.append("g")
        .selectAll("path")
        .data(features)
        .enter().append("path")
        .attr("name", function (d) {
            return d.properties.name;
        })
        .attr("id", function (d) {
            return d.id;
        })
        .attr("d", path)
        .style("fill", function (d) {
            return d.details && d.details.total ? color(d.details.total) : undefined;
        })
        .on('mouseover', function (d) {
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 1)
                .style("cursor", "pointer");

            d3.select(".country")
                .text(d.properties.name);

            d3.select(".females")
                .text(d.details && d.details.females && "Female " + d.details.females || "¯\\_(ツ)_/¯");

            d3.select(".males")
                .text(d.details && d.details.males && "Male " + d.details.males || "¯\\_(ツ)_/¯");

            d3.select('.details')
                .style('visibility', "visible")
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style("stroke", null)
                .style("stroke-width", 0.25);

            d3.select('.details')
                .style('visibility', "hidden");
        });
}