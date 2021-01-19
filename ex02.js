var ctx = {
    w: 720,
    h: 720,
    DM: {RV:"Radial Velocity", PT: "Primary Transit", ML: "Microlensing"},
};

var initSVGcanvas = function(planetData){
    // scales to compute (x,y) coordinates from data values to SVG canvas
    var maxMass = d3.max(planetData,
                         function(d){
                            if (d.mass > 0){return parseFloat(d.mass);}
                            else {return 0;}
                         });
    var maxStarMass = d3.max(planetData,
                             function(d){
                                if (d.star_mass > 0){return parseFloat(d.star_mass);}
                                else {return 0;}
                             });
    // scale star_mass -> x-axis
    ctx.xScale = d3.scaleLinear().domain([0, maxStarMass])
                                 .range([60, ctx.w-20]);
    // scale planet_mass -> y-axis
    ctx.yScale = d3.scaleLinear().domain([0, maxMass])
                                 .range([ctx.h-60, 20]);
    // x- and y- axes
    d3.select("#bkgG").append("g")
    .attr("transform", `translate(0,${ctx.h-50})`)
      .call(d3.axisBottom(ctx.xScale).ticks(10))
      .selectAll("text")
      .style("text-anchor", "middle");
    d3.select("#bkgG").append("g")
      .attr("transform", "translate(50,0)")
      .call(d3.axisLeft(ctx.yScale).ticks(10))
      .selectAll("text")
      .style("text-anchor", "end");
    // x-axis label
    d3.select("#bkgG")
      .append("text")
      .attr("y", ctx.h - 12)
      .attr("x", ctx.w/2)
      .classed("axisLb", true)
      .text("Star Mass (Msun)");
    // y-axis label
    d3.select("#bkgG")
      .append("text")
      .attr("y", 0)
      .attr("x", 0)
      .attr("transform", `rotate(-90) translate(-${ctx.h/2},18)`)
      .classed("axisLb", true)
      .text("Mass (Mjup)");
}

var populateSVGcanvas = function(planetData){
  //*filtrer mass planete =0  et masse étoile =0*//
  filteredvalues=planetData.filter(function(d){return d.mass==0;} || function(d){return d.star_mass==0;});
  //*affichage de ce filtrage renvoie les lignes qui vérifient la condition
  //*condition indiquée dans la parenthèse de la méthode filter
  console.log(filteredvalues);
  var svg = d3.select("body")
            .append("svg")
            .attr("width", 720)
            .attr("height", 720);
  var exoPlanetsGenerator = d3.symbol().type(d3.symbolCircle)
                       .size(8);
  console.log(exoPlanetsGenerator);
  //utilisation de d3 pour référencer body et pointer vers le path
  d3.select("body").selectAll("path")
   //on étudie seulement les données filtrées et non planetData
   .data(filteredvalues)
   .enter()
   .append("path")
   .attr("d", exoPlanetsGenerator());
   //updating selections with functions
  d3.selectAll('rect')
    .attr('x', function(d, i) {
      return i * 40;
  });
  //change opacity circles
  //Make a circles
  svg.append("circle")
      .attr("cx", 6)
      .attr("cy", 3)
      .attr("r", 60)
      .style("opacity", 1.0)
      .style("fill", "#f46d43");

  //mouse event
  d3.selectAll('circle')
  .on('click', function(d, i) {
    d3.select('.status')
      .text('You clicked on circle ' + i);
  });
  var x = d3.scaleLinear()
          .domain([20, 150])
          .range([0, 1000]);
  x(20); // 80
  x(50); // 320
  //couleur
  var color = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(["red", "white", "green"]);
    //.data(planetData.yearofDiscovery);

  color(-0.8); // "rgb(255, 128, 128)"
  color(+0.9); // "rgb(128, 192, 128)"

  //with interpolateHcl
  //. This interpolator factory is used to create interpolators
  //for each adjacent pair of values from the range; these interpolators
  //then map a normalized domain parameter t in [0, 1] to the corresponding value in the range.
  //If factory is not specified, returns the scale’s current interpolator
  //factory, which defaults to d3.interpolate. See d3-interpolate for more interpolators.
  var color = d3.scaleLinear()
    .domain([5, 100])
    .range(["brown", "steelblue"])
    .interpolate(d3.interpolateHcl);

  // update the element
  function update(degreAngle) {

    // adjust the text on the range slider
    d3.select("#degreAngle-value").text(degreAngle);
    d3.select("#degreAngle").property("value", degreAngle);

    // rotate the text
    svg.select("text")
      .attr("transform", "translate(300,150) rotate("+degreAngle+")");
  }





};

var createViz = function(){
    console.log("Using D3 v"+d3.version);
    var svgEl = d3.select("#main").append("svg");
    svgEl.attr("width", ctx.w);
    svgEl.attr("height", ctx.h);
    var rootG = svgEl.append("g").attr("id", "rootG");
    rootG.append("g").attr("id", "bkgG");
    loadData();
};

var loadData = function(){
    d3.csv("exoplanet.eu_catalog.csv").then(function(planets){
        initSVGcanvas(planets);
        populateSVGcanvas(planets);
    }).catch(function(error){console.log(error)});
};
