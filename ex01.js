var ctx = {
    SVG_NS: "http://www.w3.org/2000/svg",
    DEFAULT_POINT_COUNT: 20,
    GLYPH_SIZE: 12,
    w: 480,
    h: 480,
};

var createViz = function(){
    /* Method called automatically when the HTML page has finished loading. */
    // ...

    /*retrieve the element of the structure that has the id main in div */
    var mainDiv = document.getElementById("main");
    /*create a child that derivates from mainDiv*/
    var mainDiv1=document.querySelector("main");
    /*using a namespace in order to create a ns element svg not a html element*/
    var svgEl = document.createElementNS(ctx.SVG_NS, "svg");

    svgEl.setAttribute("id", "point");
    svgEl.setAttribute("id1", "rectangle");
    /*mettre attribut height width*/
    svgEl.setAttribute("height", 480);/*cadre de hauteur 480*/
    svgEl.setAttribute("width", 480);/*cadre de largeur 480*/
    /*svg enfant du mainDiv elements*/
    mainDiv.appendChild(svgEl);
    var footer=document.createElement("div");
    footer.setAttribute("class","footer");
    /*footer.appendChild(document.createTextNode('Generated with neither D3
    v${d3.version} nor Vega-Lite v${vegaEmbed.vegaLite.version}'));*/
    mainDiv.appendChild(footer);
    set();


};

var handleKeyEvent = function(e){
    /* Callback triggered when any key is pressed in the input text field.
       e contains data about the event.
       visit http://keycode.info/ to find out how to test for the right key value */
    // ...
    if (e.keyCode ==13){
      e.preventDefault();
      set();
    }



};

var set = function(){
    /* Callback triggered when the "Set" button is clicked. */
    // ...
    var recupg = document.getElementById("point");/*récupérer svgEl référence sur svgEl*/
    var gEl =document.createElementNS(ctx.SVG_NS, "g");
    recupg.appendChild(gEl);
    /*mettre un nombre random de cercles et de points*/
  //*  if (recupg.getContext) {
  //*   var con = recupg.getContext("2d");
  //*   var W = Math.random() * recupg.width;
  //*   var H = Math.random() * recupg.height;
  //*   var rad = 2;
  //*   con.beginPath();
  //*   con.arc(W, H, rad, 0, 2 * Math.PI, false);
  //*   con.stroke();
   //*}*//
   /*An HTMLElement object representing the first element in the document that matches the specified
   set of CSS selectors, or null is returned if there are no matches.*/
   /*50 par exemple*/
   var comptagefigures=document.querySelector('#countTf').value;
   //*removes whitespace from both ends of a string*/
   if (comptagefigures.trim()== ''){
     return;
   }
   var couleurshapes=document.querySelector('#searchType').value;
   populateSVGcanvas(parseInt(comptagefigures), couleurshapes);



};


var populateSVGcanvas= function(nombrePoints, searchType){
    var svgEl=document.querySelector("svg");
    while(svgEl.firstChild) {
      svgEl.removeChild(svgEl.firstChild);
    }

    var gEl=document.createElementNS(ctx.SVG_NS,"g");
    gEl.setAttribute("id", "glyphs");
    svgEl.appendChild(gEl);

    //* conditiontype couleur*//
    if (searchType == "Color"){
      //*This class implements a simple random number generator
      //* that allows clients to generate pseudorandom integers, doubles, booleans, and colors.
      //*To use it, the first step is to declare an instance variable
      var pointshasard=randomGenerator(nombrePoints-1);
      for(var compt=0; compt<pointshasard.length;compt++){
        gEl.appendChild(generateCircle(pointshasard[compt],"blue"));
      }
      var pointshasard=randomGenerator(1);
      gEl.appendChild(generateCircle(pointshasard[compt],"red"));
    }
    //*condition type forme*//
    else if (searchType == "Shape"){
      //*This class implements a simple random number generator
      //* that allows clients to generate pseudorandom integers, doubles, booleans, and colors.
      //*To use it, the first step is to declare an instance variable
      var pointshasard=randomGenerator(nombrePoints-1);
      for(var compt=0; compt<pointshasard.length;compt++){
        gEl.appendChild(generateCircle(pointshasard[compt],"red"));
      }
      var pointshasard=randomGenerator(1);
      gEl.appendChild(generateCircle(pointshasard[compt],"red"));
    }
    //* condition type couleur & forme *//
    else{
      /*pointshasard est un tableau*/
      var pointshasard=randomGenerator(nombrePoints/2);
      for(var compt=0; compt<pointshasard.length;compt++){
        gEl.appendChild(generateCircle(pointshasard[compt],"red"));
      }
      var pointshasard=randomGenerator(nombrePoints/2);
      for(var compt=0; compt<pointshasard.length;compt++){
        gEl.appendChild(generateCircle(pointshasard[compt],"blue"));
      }
      var pointshasard=randomGenerator(1);
      gEl.appendChild(generateCircle(pointshasard[0],"red"));

    }


}
//*classe randomGenerator*//
var randomGenerator= function(nombrePoints){
  var tab=[]
  for(var compt=0; compt<nombrePoints;compt++){
    tab.push([Math.floor(Math.random()*(ctx.w-ctx.GLYPH_SIZE))+ ctx.GLYPH_SIZE/2.0,
    Math.floor(Math.random()*(ctx.h-ctx.GLYPH_SIZE)+ ctx.GLYPH_SIZE/2.0)]);
  }
  console.log(tab);
  return tab;

}
//* pour génerer des cercles*//
var generateCircle= function(pos, color){

  console.log(pos);
  var cercle = document.createElementNS(ctx.SVG_NS, "circle");

  cercle.setAttribute("cx", pos[0]);
  cercle.setAttribute("cy",  pos[1]);
  /*mettre attribut rayon width*/
  cercle.setAttribute("r", ctx.GLYPH_SIZE/2.0);/*cadre de hauteur 480*/
  cercle.setAttribute("fill", color);
  return cercle;

}

//*pour génerer des rectangles*//
var  generateRectangle= function(pos, color){
  console.log(pos);
  var rectang = document.createElementNS(ctx.SVG_NS, "rectangle");
  rectang.setAttribute("x", pos[0]-ctx.GLYPH_SIZE/2.0);
  rectang.setAttribute("y",  pos[1]-ctx.GLYPH_SIZE/2.0);
  /*mettre attribut rayon width*/
  rectang.setAttribute("width", ctx.GLYPH_SIZE);/*cadre de hauteur 480*/
  rectang.setAttribute("height", ctx.GLYPH_SIZE);
  rectang.setAttribute("fill", color);
  return rectan;

}
