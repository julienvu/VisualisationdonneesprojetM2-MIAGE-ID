var ctx = {
    GLYPH_SIZE: 24,
    w: 720,
    h: 720,
    DM: {RV:"Radial Velocity", PT: "Primary Transit", ML: "Microlensing"},
};

var circleGen = d3.symbol().type(d3.symbolCircle)
				  .size(ctx.GLYPH_SIZE);

var crossGen = d3.symbol().type(d3.symbolCross)
				 .size(ctx.GLYPH_SIZE);

var triangleGen = d3.symbol().type(d3.symbolTriangle)
    			    .size(ctx.GLYPH_SIZE);

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
    // color scale
    ctx.cScale = d3.scaleLinear().domain(
                                    d3.extent(planetData,
                                        function(d){
                                            return parseInt(d.discovered);
                                        })
                                 )
                                 .range(['#193152', '#4ba4ff'])
                                 .interpolate(d3.interpolateHcl);
    // 1 Msun & 1 MJup indicators
    d3.select("#bkgG")
      .append("line")
      .attr("x1", 0)
      .attr("y1", ctx.yScale(1))
      .attr("x2", ctx.w)
      .attr("y2", ctx.yScale(1))
      .style("stroke", "#DDD");
    // ... cont'd
    d3.select("#bkgG")
      .append("line")
      .attr("x1", ctx.xScale(1))
      .attr("y1", 0)
      .attr("x2", ctx.xScale(1))
      .attr("y2", ctx.h)
      .style("stroke", "#DDD");
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
    // put them in three separate <g> to make it easier to manage, e.g., visibility toggling
    d3.select("#RV").selectAll("path")
      .data(planetData.filter(function(d){
        return (d.mass > 0 && d.star_mass > 0 && d.detection_type == ctx.DM.RV);
      }))
      .enter()
      .append("path")
      .attr("d", circleGen())
      .attr("transform", function(d){
          return planetTranslator(d.star_mass, d.mass);
      })
      .attr("stroke", function(d){return ctx.cScale(d.discovered)});

    d3.select("#PT").selectAll("path")
      .data(planetData.filter(function(d){
        return (d.mass > 0 && d.star_mass > 0 && d.detection_type == ctx.DM.PT);
      }))
      .enter()
      .append("path")
      .attr("d", crossGen())
      .attr("transform", function(d){
          return planetTranslator(d.star_mass, d.mass);
      })
      .attr("fill", function(d){return ctx.cScale(d.discovered)});

    d3.select("#ML").selectAll("path")
      .data(planetData.filter(function(d){
          return (d.mass > 0 && d.star_mass > 0 && d.detection_type == ctx.DM.ML);
      }))
      .enter()
      .append("path")
      .attr("d", triangleGen())
      .attr("transform", function(d){
          return planetTranslator(d.star_mass, d.mass);
      })
      .attr("stroke", function(d){return ctx.cScale(d.discovered)});
};

var planetTranslator = function(starMass, planetMass){
    return `translate(${ctx.xScale(starMass)},${ctx.yScale(planetMass)})`;
};

var createViz = function(){
    console.log("Using D3 v"+d3.version);
    var svgEl = d3.select("#main").append("svg");
    svgEl.attr("width", ctx.w);
    svgEl.attr("height", ctx.h);
    var rootG = svgEl.append("g").attr("id", "rootG");
    // group for background elements (axes, labels)
    rootG.append("g").attr("id", "bkgG");
    // group for exoplanets detected using MicroLensing
    rootG.append("g").attr("id", "ML").classed("planets", true);
    // group for exoplanets detected using Radial Velocity
    rootG.append("g").attr("id", "RV").classed("planets", true);
    // group for exoplanets detected using Primary Transit
    rootG.append("g").attr("id", "PT").classed("planets", true);
    loadData();
};

var loadData = function(){
    d3.csv("exoplanet.eu_catalog.csv").then(function(planets){
        initSVGcanvas(planets);
        populateSVGcanvas(planets);
    }).catch(function(error){console.log(error)});
};
