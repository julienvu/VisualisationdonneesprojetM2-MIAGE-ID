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
  //*filtrer mass planete !=0  et(qui s'écrit && en javascript) masse étoile !=0*//
  filteredvalues=planetData.filter(function(d){return d.mass!=0;} && function(d){return d.star_mass!=0;});
  //*affichage de ce filtrage renvoie les lignes qui vérifient la condition
  //*condition indiquée dans la parenthèse de la méthode filter
  console.log(filteredvalues);
  //.append(svg) et non append(body)
  var svg = d3.select("body")
            .append("svg")
            .attr("width", 720)
            .attr("height", 720);
  var exoPlanetsGenerator = d3.symbol().type(d3.symbolCircle)
                       .size(29);
  var exoPlanetsGenerator1 = d3.symbol().type(d3.symbolTriangle).size(38);
  var exoPlanetsGenerator2 = d3.symbol().type(d3.symbolCross).size(45);
  var exoPlanetsGenerator3 = d3.symbol().type(d3.symbolDiamond).size(27);
  console.log(exoPlanetsGenerator);
  //utilisation de d3 pour référencer body et pointer vers le path
  d3.select("svg").selectAll("path")
   //on étudie seulement les données filtrées et non planetData
   .data(filteredvalues)
   .enter()
   .append("path")
   .style("opacity", 0.3)
   .style("stroke", function(d){
        if(d.value < 1 && d.value>30) {return 'purple'} else {return 'pink'}
    })
   .style("font-size", "16px")
   .style("text-decoration", "underline")

   //utiliser la méthode transform pour translater les points en haut à gauche en bas à droite pour obtenir des pixels
   .attr("transform", function(d){console.log(d);coordxpixelsx=ctx.xScale(d.star_mass);coordxpixelsy=ctx.yScale(d.mass);return "translate(" + coordxpixelsx + "," + coordxpixelsy + ")";})
   //faire plusieurs if d est unique pas de d1 ou autre appellation pour l'ajout des motifs
   .attr("d", function(d){
        //3 conditions pour autant de type de detection
        if(d.detection_type=="Primary Transit"){
          return exoPlanetsGenerator();

        }
        if(d.detection_type=="Radial Velocity"){
          return exoPlanetsGenerator1();

        }
        if(d.detection_type=="Microlensing"){
          return exoPlanetsGenerator2();

        }
        //1 condition sur l annee de découverte de la planete
        if(d.discovered==2012 || d.discovered==2018){
          return exoPlanetsGenerator3();

        }

   }
   );
   //on fait dans un d3.select("svg").append("text") car on ne fait pas de mappage
   //sur les données mais juste un ajout
   d3.select("svg").append("text")
    //positions du text avec .attr("x", 200) et attr("y", 20)
    .attr("x", 200)
    .attr("y", 20)
    .text("Représentation graphique des exos planetes selon la mass et star_mass(ord/abs)")
    .attr("font-family", "calibri")
    .attr("font-size", "14px")


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
  color1(-0.8); // "rgb(255, 128, 128)"
  color1(+0.9); // "rgb(128, 192, 128)"
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
