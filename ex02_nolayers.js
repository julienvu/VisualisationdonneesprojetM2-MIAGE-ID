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

    // Step 1: Filtering data: from 3824 entries to 1447 entries
    var filteredPlanetData = planetData.filter(function(e) {
      return !(e.mass==0 || e.star_mass==0)
        && (e.detection_type === ctx.DM.RV || e.detection_type === ctx.DM.PT || e.detection_type === ctx.DM.ML);
    });

    //// Step 2: Testing if you can draw an SVG element
    //// create a SVG group where to display data points
    // var group = d3.select("#rootG");
    // // draw a black circle in the scatterplot at coordinate (1,1)
    // group.append("circle")
    //     .attr("cx", ctx.xScale(1))
    //     .attr("cy", ctx.yScale(1))
    //     .attr("r", 10);

    //// Step 3: Display each data point as a black circle at the right coordinates, and check that point distribution is similar to what is expected
    // var group = d3.select("#rootG");
    // group.selectAll("circle")
    //   .data(filteredPlanetData)
    //   .enter()
    //   .append("circle")
    //   .attr("cx", function(d) { return ctx.xScale(d.star_mass); })
    //   .attr("cy", function(d) { return ctx.yScale(d.mass); })
    //   .attr("r", 5);

    //// Step 4: Display each data point as a black circle at the right coordinates, but using path elements (encode geometry in d attribute and position with transform attribute)
    // var circleGenerator = d3.symbol().type(d3.symbolCircle).size(20);
    //
    // var group = d3.select("#rootG");
    // group.selectAll("path")
    //   .data(filteredPlanetData)
    //   .enter()
    //   .append("path")
    //   .attr("stroke", "black")
    //   .attr("fill", "none")
    //   .attr("d", circleGenerator())
    //   .attr("transform", function(d) {
    //      return `translate(${ctx.xScale(d.star_mass)}, ${ctx.yScale(d.mass)})`;
    //    });


    //// Step 5: Encode detection type as shape using three symbol generators
    var circleGenerator = d3.symbol().type(d3.symbolCircle).size(20);
    var crossGenerator = d3.symbol().type(d3.symbolCross).size(20);
    var triangleGenerator = d3.symbol().type(d3.symbolTriangle).size(20);

    var group = d3.select("#rootG");
    group.selectAll("path")
      .data(filteredPlanetData)
      .enter()
      .append("path")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", function(d) {
        if(d.detection_type === ctx.DM.PT) { // Primary Transit
          return triangleGenerator();
        } else if(d.detection_type === ctx.DM.ML) { // Microlensing
          return crossGenerator();
        } else { // Radial Velocity
          return circleGenerator();
        }

      })
      .attr("transform", function(d) {
         return `translate(${ctx.xScale(d.star_mass)}, ${ctx.yScale(d.mass)})`;
       });

    //// Step 6: Encode year of discovery with color brilliance
    //// Create a color scale and change the value of stroke attribute (note that each shape is binded to its datum so we can still access data with function(d) {...})
    var yearInterval = d3.extent(planetData, function(d){ return parseInt(d.discovered); });
    var colorScale = d3.scaleLinear().domain(yearInterval)
                                 .range(['#193152', '#4ba4ff'])
                                 .interpolate(d3.interpolateHcl);
    group.selectAll("path")
      .attr("stroke", function(d) { return colorScale(d.discovered); })
      .attr("stroke-width", 1.5);

    //// Step 7: gray line indicators for 1 Msun and 1 Mjup in the background layer
    d3.select("#bkgG")
      .append("line")
      .attr("x1", 0)
      .attr("y1", ctx.yScale(1))
      .attr("x2", ctx.w)
      .attr("y2", ctx.yScale(1))
      .attr("stroke", "#D3D3D3");
    d3.select("#bkgG")
      .append("line")
      .attr("x1", ctx.xScale(1))
      .attr("y1", 0)
      .attr("x2", ctx.xScale(1))
      .attr("y2", ctx.h)
      .attr("stroke", "#D3D3D3");
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
