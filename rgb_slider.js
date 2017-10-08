// ____ Update all sliders on selectedSet change
// ____ Make width slider functional for more than just the first set
// ____ Create scale slider / add/subtract horiz/vert lines option
// ____ Create saved set code for import/export
// ____ Create printable version

var setCount = 1;
var selectedSet = 1;
var sets = [
      {
          "r": 2,
          "g": 200,
          "b": 60,
          "a": 30,
          "leftPx": 20,
          "rightPx": 140
      }
  ];

function hexFromRGB(r, g, b) {
    var hex = [
      r.toString( 16 ),
      g.toString( 16 ),
      b.toString( 16 )
    ];
    $.each( hex, function( nr, val ) {
      if ( val.length === 1 ) {
        hex[ nr ] = "0" + val;

      }
    });
    console.log(hex);
    return hex.join( "" ).toUpperCase();
}

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function setRGBA(r,g,b,a){
    var rgba = "rgba("+r+", "+g+", "+b+", "+a+")";
    $( "#sw"+ selectedSet +" .swatch" ).css("background-color", rgba );
    // console.log("sw color is "+rgba);
    console.log("opacity is"+a)
    $( "#ui"+ selectedSet +" .color" ).val("Color: " + rgba );
    $( "#ui"+ selectedSet +" .color" ).css("background-color", rgba );

    // determine if text should be white or black over this color
    textColorUpdate(r,g,b,a);
}

function textColorUpdate(r,g,b,a) {
  var whiteText = 0;
    sumColors = r + g + b;
    if (a < 0.4 || sumColors > 379) {
      $( "#ui"+ selectedSet +" .color" ).css( "color", "#ffffff" );
    } else {
      $( "#ui"+ selectedSet +" .color" ).css( "color", "#000000" );
    }
}

function initializeSwatch() {
  // console.log("refreshSwatch()");

    var r = sets[selectedSet-1].r,
        g = sets[selectedSet-1].g,
        b = sets[selectedSet-1].b,
        a = sets[selectedSet-1].a/100;

    setRGBA(r,g,b,a);
}

function refreshSwatch(s) {
  // console.log("refreshSwatch()");

    var r = sets[selectedSet-1].r,
        g = sets[selectedSet-1].g,
        b = sets[selectedSet-1].b,
        a = sets[selectedSet-1].a/100;

    if (s == "all") {
      // console.log("all refresh");

      //set value based on slider
      r = $( ".red" ).slider( "value" ),
      g = $( ".green" ).slider( "value" ),
      b = $( ".blue" ).slider( "value" );
      //update sets array
      sets[selectedSet-1].r = r;
      sets[selectedSet-1].g = g;
      sets[selectedSet-1].b = b;

    } else if (s == "red"){
      // console.log("red refresh");

      //set value based on slider
      r = $( ".red" ).slider( "value" );
      //update sets array
      sets[selectedSet-1].r = r;

    } else if (s == "green") {
            // console.log("green refresh");

      //set value based on slider
      g = $( ".green" ).slider( "value" );
      //update sets array
      sets[selectedSet-1].g = g;

    } else if (s == "blue") {
            // console.log("blue refresh");

      //set value based on slider
      b = $( ".blue" ).slider( "value" );
      //update sets array
      sets[selectedSet-1].b = b;

    }

    setRGBA(r,g,b,a);
}

function refreshWidthSlider(event,ui) {

        var spaceOutside = ui.values[0];
        var width = ui.values[1] - ui.values[0];
        var spaceInside = 150 - ui.values[1];
        $( ".positionWidthLabel" ).html("Outside: " + spaceOutside + "px<br>Width: " + width + "px<br>Inside: " + spaceInside + "px");
        $( "#sw"+selectedSet+" .vert.a").css({"margin-left":spaceOutside, "width":width, "margin-right":spaceInside});
        $( "#sw"+selectedSet+" .vert.b").css({"margin-left":spaceInside, "width":width, "margin-right":spaceOutside});
        $( "#sw"+selectedSet+" .horiz.a").css({"margin-top":spaceOutside, "height":width, "margin-bottom":spaceInside});
        $( "#sw"+selectedSet+" .horiz.b").css({"margin-top":spaceInside, "height":width, "margin-bottom":spaceOutside});
        console.log("width changed");
}

function initializeSliders(state) {
  // console.log("initializeSliders()");
  var r = sets[selectedSet-1].r,
      g = sets[selectedSet-1].g,
      b = sets[selectedSet-1].b;

  if (state !== "initial") { $( ".red, .green, .blue", ".opacity" ).slider("destroy");}

    // console.log("initializing red slider");
    $( ".red" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: r,
      slide: function(){refreshSwatch("red")},
      change: function(){refreshSwatch("red")}
    });
    // console.log("red initialized");
    $( ".green" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: g,
      slide: function(){refreshSwatch("green")},
      change: function(){refreshSwatch("green")}
    });
    // console.log("green initialized");
    $( ".blue" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: b,
      slide: function(){refreshSwatch("blue")},
      change: function(){refreshSwatch("blue")}
    });
    // console.log("blue initialized");

    // start position and width slider
    $( ".slider-range" ).slider({
      range: true,
      min: 0,
      max: 150,
      values: [ sets[selectedSet-1].leftPx , sets[selectedSet-1].rightPx ],
      slide: function(event,ui) {
        refreshWidthSlider(event,ui)
      }
    });

    // Set Swatch Divs to reflect initialized LeftPx and RightPx values
    var leftPx = sets[selectedSet-1].leftPx;
    var rightPx = sets[selectedSet-1].rightPx;
        var spaceOutside = leftPx;
        var width = rightPx - leftPx;
        var spaceInside = 150 - rightPx;
        $( ".positionWidthLabel" ).html("Outside: " + spaceOutside + "px<br>Width: " + width + "px<br>Inside: " + spaceInside + "px");
        $( "#sw"+selectedSet+" .vert.a").css({"margin-left":spaceOutside, "width":width, "margin-right":spaceInside});
        $( "#sw"+selectedSet+" .vert.b").css({"margin-left":spaceInside, "width":width, "margin-right":spaceOutside});
        $( "#sw"+selectedSet+" .horiz.a").css({"margin-top":spaceOutside, "height":width, "margin-bottom":spaceInside});
        $( "#sw"+selectedSet+" .horiz.b").css({"margin-top":spaceInside, "height":width, "margin-bottom":spaceOutside});


    // opacity
    $( ".opacity" ).slider({
      min: 0,
      max: 100,
      value: (sets[selectedSet-1].a)/100,
      slide: function( event, ui ) {
        var a = ui.value/100,
        r = sets[selectedSet-1].r,
        g = sets[selectedSet-1].g,
        b = sets[selectedSet-1].b;
        
        setRGBA(r,g,b,a);
      }
    });
}

$(function(){

      initializeSliders("initial");
      initializeSwatch();
      
      // add new
      $( ".add-new" ).click(function(){     //console.log("click plus");
        setCount++; 
        selectedSet = setCount;
        // console.log('setCount and selectedSet is ' + setCount);

        $('#sw1').clone().attr('id', 'sw'+ setCount).insertAfter($('#sw'+(setCount-1))); // add new swatches on top of previous ones
        $('button.select-set[data-set="1"]').clone().attr('data-set', setCount).html('Set ' + setCount).insertAfter($('button.select-set[data-set="'+(setCount-1)+'"]')); // add new Set Select Button
        
        var randomRangeA = randomIntFromInterval(0,253);
        var randomRangeB = randomIntFromInterval(randomRangeA,255);

        var randomSetValues = [];
        randomSetValues.push(randomIntFromInterval(0,255));
        randomSetValues.push(randomIntFromInterval(0,255));
        randomSetValues.push(randomIntFromInterval(0,255));
        randomSetValues.push(randomIntFromInterval(10,60));
        randomSetValues.push(randomRangeA);
        randomSetValues.push(randomRangeB);

        console.log(randomSetValues);

       var newSet = {
          "r": randomSetValues[0],
          "g": randomSetValues[1],
          "b": randomSetValues[2],
          "a": randomSetValues[3],
          "leftPx": randomSetValues[4],
          "rightPx": randomSetValues[5]};
       sets.push(newSet);
       // console.log(sets);

       initializeSliders();
       initializeSwatch();
      }); 

      $("body").on("click", ".select-set", function(){
        selectedSet = $(this).attr("data-set");
        console.log('selectedSet is ' + selectedSet);
      });



// Shadow Sandbox
function makeShadows() {
  // grab element
  $.each($('.shadowed'), function(){
   var top = $(this).top();
   var bot = $(this).bottom();
   
   // NOT WORKING
   console.log(top);

    if ($(hasShadow).hasClass('shadow-left')) {

    } else if ($(hasShadow).hasClass('shadow-right')) {

    } else {

    }
  });
}

makeShadows();


});