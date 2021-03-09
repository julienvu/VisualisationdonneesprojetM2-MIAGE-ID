var createPlot = function(){
  vlSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "background": "white",
    "config": {
    "view": {"stroke": "transparent"}
    },
    "projection": {
    "type": "albersUsa"
    },
    "layer": [
    {
    "data": {
    "url": "us-10m.json",
    "format": {
    "type": "topojson",
    "feature": "states"
    }
    },
    "mark": {
    "type": "geoshape",
    "fill": "transparent",
    "stroke": "#CCC"
    }
  },
  {
      "data": {
        "url": "airports.json"
      },
      "transform": [
      {"filter":" !test( /[0-9]/, datum.iata) && datum.TimeZone == null "},
      //{"filter":" !test( /[0-9]/, datum.iata) && datum.TimeZone == null "},
      //{"filter": "!test(/\\d/, datum.iata) && datum.TimeZone != null"},
      {

        "lookup": "state",

        "from": {
          "data": {"url": "states_tz.csv"},
          "key": "State",
          "fields":["TimeZone"]

        }

      }],
      "projection": {
        "type": "albersUsa"
      },
      "mark": "point",
      "encoding": {
        "longitude": {
          "field": "longitude",
          "type": "quantitative"
        },
        "latitude": {
          "field": "latitude",
          "type": "quantitative"
        },
        "size": {"value": 20},
        //"color": {"value": "steelblue"}
        "color": {"field": "TimeZone", "type": "nominal"}
      }
    }
    ]
};

    vlOpts = {width:1000, height:600, actions:false};
    vegaEmbed("#map", vlSpec, vlOpts);

};
