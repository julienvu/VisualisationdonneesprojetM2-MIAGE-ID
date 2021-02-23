var ctx = {
    w: 1200,
    h: 400,
    GREY_NULL: "#DFDFDF",
    vmargin: 2,
    hmargin: 4,
    timeParser: d3.timeParse("%Y-%m-%d"),
    timeAxisHeight: 20,
};

var transformData = function(data){
    var res = {dates:[], series:[]};
    var values_per_city = {};
    for (k in data[0]){
        if (k != "Date"){
            values_per_city[k] = [];
        }
    }
    // populates the dates array with Date attribute values_per_city
    // from each item in data
    res.dates = data.map(d => d.Date);
    data.forEach(
        function(d){
            for (k in d){
                if (k != "Date"){
                    values_per_city[k].push(d[k]);
                }
            }
        }
    );
    // populate series with the 3 composite indices first
    for (k of ["National-US", "Composite-10", "Composite-20"]){
        res.series.push({"name": k, "values": values_per_city[k]});
        delete values_per_city[k];
    }
    // then with individual cities, sorted by DTW distance to National-US
    // https://github.com/GordonLesti/dynamic-time-warping
    var cities = [];
    for (k in values_per_city){
        // series[0] is National-US
        var dtwDist = (new DynamicTimeWarping(res.series[0].values,
                                              values_per_city[k],
                                              distFunc)).getDistance();
        cities.push({"name": k, "values": values_per_city[k], "dtw": dtwDist});
    }
    cities.sort((a,b) => d3.ascending(a.dtw, b.dtw));
    res.series.push.apply(res.series, cities);
    return res;
};

var distFunc = function(a, b){
    return Math.abs(a-b);
};

var createMaps = function(data, svgEl){
    console.log(data);
    ctx.xScale = d3.scaleLinear().domain([0, 200])
                               .range([ctx.w-60, 20]);
    //*créer 23 éléments g
    var color = d3.scaleLinear()
    .domain([d3.min, 100, d3.max])
    .range(["red", "white", "blue"]);
    data.series.forEach((item, i) => {
      var elt=svgEl.append('g')
      .attr("transform", "translate(4,"+ (i*25) +")")

      //*associer tableau values à
      elt.selectAll('line').data(item.values).enter().append("line")
      .attr("x1", function(d,i){return i;})
      .attr("y1",ctx.vmargin )
      .attr("x2", function(d,i){return i;})
      .attr("y2",ctx.vmargin+20)
      .attr('fill', function(d){ if(d == null) return ctx.GREY_NULL;})
      .attr('stroke',function(d){return color(d)});
      //créer element text
      elt.append("text")
      .attr("transform", "translate(350,"+ (12) +")")
      //addint text elements name of cities in the yaxis
      .text(item.name)


      var x = d3.scaleTime()
        .domain([ctx.timeParser("1987-01-01"), ctx.timeParser("2015-12-01")]);

      x.ticks(d3.timeYear.every(5));
      d3.select("#bkgG").append("g")
      .call(d3.axisRight(ctx.xScale).ticks(10));

    });




};

var createViz = function(){
    console.log("Using D3 v"+d3.version);
    var svgEl = d3.select("#main").append("svg");
    svgEl.attr("width", ctx.w);
    svgEl.attr("height", ctx.h);
    loadData(svgEl);
};

var loadData = function(svgEl){
    d3.json("house_prices.json").then(function(data){
        createMaps(transformData(data), svgEl);
    }).catch(function(error){console.log(error)});
};
