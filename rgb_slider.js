// ____ Update all sliders on selectedSet change
// ____ Make width slider functional for more than just the first set
// ____ Create scale slider / add/subtract horiz/vert lines option
// ____ Create saved set code for import/export
// ____ Create printable version

var setCount = 1; // total number of sets
var selectedSet = 1; // selected set #
var r,g,b,a;


// all set data (sets[0].r = first set's Red value)
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

// convert #ffffff to rgba(255,255,255,1)
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
    // console.log(hex);
    return hex.join( "" ).toUpperCase();
}

// get random number between min and max
function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

// get data to pass into applyData() to set up a new set - must happen at page load and after random set data is generated
// state is either 'init' or 0
function getData(state) {
  console.log("getData()");

    r = sets[selectedSet-1].r,
    g = sets[selectedSet-1].g,
    b = sets[selectedSet-1].b,
    a = sets[selectedSet-1].a,
    leftPx = sets[selectedSet-1].leftPx,
    rightPx = sets[selectedSet-1].rightPx;
    // console.log('a: '+a);
    // console.log('leftPx: ' + leftPx);
    // console.log('rightPx: ' + rightPx);

    applyData(r,g,b,a,leftPx,rightPx,state);
}

// runs within getData();
// applies initial colors, ranges, opacity for the selected set
function applyData(r,g,b,a,leftPx,rightPx,state){
  console.log('applyData()');
  var rgba = "rgba("+r+", "+g+", "+b+", "+a/100+")";

  // once per set (at selectedSet init)
  if (state === 'initSet') {
    // add color and opacity to plaid set
    $( "#sw"+ selectedSet +" .swatch" ).css("background-color", rgba );
  }
    
  // every time selectedSet is changed
    // add color and opacity to UI color sample
    $( ".color" ).val("Color: " + rgba );
    $( ".color" ).css("background-color", rgba );
    // determine if text should be white or black over this color in UI color sample
    textColorUpdate(r,g,b,a);

    // 
}

// set text on color sample to either white or black for best contrast
function textColorUpdate(r,g,b,a) {
  
  var whiteText = 0;
  sumColors = r + g + b;
  if (a > 40 || sumColors < 379) {
    $( ".color" ).css( "color", "#ffffff" );
  } else {
    $( ".color" ).css( "color", "#000000" );
  }
}

function refreshSwatch(change,state) {
  console.log("refreshSwatch()");

    // get defaults to pass along if unchanged
    var r = sets[selectedSet-1].r,
        g = sets[selectedSet-1].g,
        b = sets[selectedSet-1].b,
        a = (sets[selectedSet-1].a);
        console.log("Slider Value: " + $( ".opacity" ).slider( "value" ));

    // future use (dark vs light)
    if (change === "all") { // console.log("all refresh");

      r = $( ".red" ).slider( "value" ),
      g = $( ".green" ).slider( "value" ),
      b = $( ".blue" ).slider( "value" ); //set values based on slider
      sets[selectedSet-1].r = r;
      sets[selectedSet-1].g = g;
      sets[selectedSet-1].b = b; //update sets array

    } else if (change === "red"){ // console.log("red refresh");
      r = $( ".red" ).slider( "value" ); //set value based on slider
      sets[selectedSet-1].r = r; //update sets array

    } else if (change === "green") { // console.log("green refresh");
      g = $( ".green" ).slider( "value" ); //set value based on slider
      sets[selectedSet-1].g = g; //update sets array

    } else if (change === "blue") { // console.log("blue refresh");
      b = $( ".blue" ).slider( "value" ); //set value based on slider
      sets[selectedSet-1].b = b; //update sets array

    } else if (change === "opacity") { // console.log("blue refresh");
      a = $( ".opacity" ).slider( "value" ); //set value based on slider
      sets[selectedSet-1].a = a; //update sets array
      console.log('Opacity Updated in the Set to: '+sets[selectedSet-1].a);
      console.log('Opacity decimal: '+a);

    }

    applyData(r,g,b,a,leftPx,rightPx,state);
}

function widthFromSlider(event,ui) {
  console.log('widthFromSlider()');
  updateWidth(ui.values[0],ui.values[1]);
}

function updateWidth(leftPx,rightPx){
  console.log('updateWidth()');
  // update data
  sets[selectedSet-1].leftPx = leftPx;
  sets[selectedSet-1].rightPx = rightPx;
  var spaceOutside = leftPx;
  var width = rightPx - leftPx;
  var spaceInside = 150 - rightPx;
  $( ".stats" ).html("Outside: " + spaceOutside + "px<br>Width: " + width + "px<br>Inside: " + spaceInside + "px");
  $( "#sw"+selectedSet+" .vert.a").css({"margin-left":spaceOutside, "width":width, "margin-right":spaceInside});
  $( "#sw"+selectedSet+" .vert.b").css({"margin-left":spaceInside, "width":width, "margin-right":spaceOutside});
  $( "#sw"+selectedSet+" .horiz.a").css({"margin-top":spaceOutside, "height":width, "margin-bottom":spaceInside});
  $( "#sw"+selectedSet+" .horiz.b").css({"margin-top":spaceInside, "height":width, "margin-bottom":spaceOutside});
}

function initializeSliders() {
  console.log("initializeSliders()");
  
  // get data for this set
  var r = sets[selectedSet-1].r,
      g = sets[selectedSet-1].g,
      b = sets[selectedSet-1].b,
      a = sets[selectedSet-1].a,
      leftPx = sets[selectedSet-1].leftPx,
      rightPx = sets[selectedSet-1].rightPx,
      state = 'initSet';

    // console.log("initializing red slider");
    $( ".red" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: r,
      slide: function(){refreshSwatch("red",state)},
      change: function(){refreshSwatch("red",state)}
    });
    // console.log("red initialized");
    $( ".green" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: g,
      slide: function(){refreshSwatch("green",state)},
      change: function(){refreshSwatch("green",state)}
    });
    // console.log("green initialized");
    $( ".blue" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: b,
      slide: function(){refreshSwatch("blue",state)},
      change: function(){refreshSwatch("blue",state)}
    });
    // console.log("blue initialized");

    // start position and width slider
    $( ".range" ).slider({
      range: true,
      min: 0,
      max: 150,
      values: [ leftPx , rightPx ],
      slide: function(event,ui) {
        widthFromSlider(event,ui)
      }
    });

    // Set Swatch Divs to reflect initialized LeftPx and RightPx values
    var leftPx = sets[selectedSet-1].leftPx;
    var rightPx = sets[selectedSet-1].rightPx;
    updateWidth(leftPx,rightPx);
        
    // opacity
    $( ".opacity" ).slider({
      min: 0,
      max: 100,
      value: a,
      slide: function(){refreshSwatch("opacity",state)},
      change: function(){refreshSwatch("opacity",state)}
      // slide: function( event, ui ) {
      //   var a = ui.value/100,
      //   r = sets[selectedSet-1].r,
      //   g = sets[selectedSet-1].g,
      //   b = sets[selectedSet-1].b;
        
      //   applyData(r,g,b,a);
      // }
    });
}

//
function updateSliders() {
  console.log("updateSliders()");
  var r = sets[selectedSet-1].r,
      g = sets[selectedSet-1].g,
      b = sets[selectedSet-1].b,
      a = sets[selectedSet-1].a,
      leftPx = sets[selectedSet-1].leftPx,
      rightPx = sets[selectedSet-1].rightPx;

  // if (state !== "initial") { $( ".red, .green, .blue", ".opacity" ).slider("destroy");}

    // console.log("updating red slider");
    $( ".red" ).slider({value: r});
    // console.log("red updated");
    $( ".green" ).slider({value: g});
    // console.log("green updated");
    $( ".blue" ).slider({value: b});
    // console.log("blue updated");

    // update position and width slider
    $( ".range" ).slider({values: [ leftPx , rightPx ]});

    // Set Swatch Divs to reflect initialized LeftPx and RightPx values
    updateWidth(leftPx,rightPx);

    // opacity
    $( ".opacity" ).slider({value: a});
}

$(function(){
  
      // only on page load
      initializeSliders();
      getData('initSet');
      
      // add new
      $( ".add-new" ).click(function(){     
        console.log("click plus");
        setCount++; 
        selectedSet = setCount;
        // console.log('setCount and selectedSet is ' + setCount);

        $('#sw1').clone().attr('id', 'sw'+ setCount).insertAfter($('#sw'+(setCount-1))); // add new swatches on top of previous ones
        $('button.select-set[data-set="1"]').clone().attr('data-set', setCount).html('Set ' + setCount).insertAfter($('button.select-set[data-set="'+(setCount-1)+'"]')); // add new Set Select Button
        
        var randomRangeA = randomIntFromInterval(0,148);
        var randomRangeB = randomIntFromInterval(randomRangeA,150);

      //   var randomSetValues = [];
      //   randomSetValues.push(randomIntFromInterval(0,255)); // r
      //   randomSetValues.push(randomIntFromInterval(0,255)); // g
      //   randomSetValues.push(randomIntFromInterval(0,255)); // b
      //   randomSetValues.push(randomIntFromInterval(10,60)); // a
      //   randomSetValues.push(randomRangeA);                 // leftPx
      //   randomSetValues.push(randomRangeB);                 // rightPx

      //   console.log(randomSetValues);

      //  var newSet = {
      //     "r": randomSetValues[0],
      //     "g": randomSetValues[1],
      //     "b": randomSetValues[2],
      //     "a": randomSetValues[3],
      //     "leftPx": randomSetValues[4],
      //     "rightPx": randomSetValues[5]};
      //  sets.push(newSet);
      //  // console.log(sets);

      var newSet = {
         "r": randomIntFromInterval(0,255),
         "g": randomIntFromInterval(0,255),
         "b": randomIntFromInterval(0,255),
         "a": randomIntFromInterval(10,60),
         "leftPx": randomRangeA,
         "rightPx": randomRangeB
        };
      sets.push(newSet);
      console.log(sets);

       initializeSliders();
       getData('initSet');
      }); 

      $("body").on("click", ".select-set", function(){
        selectedSet = $(this).attr("data-set");
        console.log('selectedSet is ' + selectedSet);
        getData(0); // not initial, no need to update swatch bars, just picker UI
        initializeSliders();
        
      });



// Shadow Sandbox
// function makeShadows() {
//   // grab element
//   $.each($('.shadowed'), function(){
//    var top = $(this).top();
//    var bot = $(this).bottom();
   
//    // NOT WORKING
//    console.log(top);

//     if ($(hasShadow).hasClass('shadow-left')) {

//     } else if ($(hasShadow).hasClass('shadow-right')) {

//     } else {

//     }
//   });
// }

// makeShadows();


});