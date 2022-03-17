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