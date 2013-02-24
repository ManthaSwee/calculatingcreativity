//this tracks the color distribution and increment val
var colortrack = 150;
var increment = 10;

//this is used to calculate aggregate average
var right = 0;
var total = 0;

//this is the id of each box
var boxstring = 0;

//number of boxes, width and height
var sidelength = 5;

//current tracker for color box turns when clicked
var newmidcolor = 220;

var stage = new Kinetic.Stage({
    container: 'container',
    width: 922,
    height: 696,
});

//answers to questions
var answers = ["star", "phone", "book", "fire", "pin", 
	       "cheese", "chair", "slow", "party", "hard", 
	       "green", "floor", "stone", "bar", "fountain",
	       "ball", "go", "cover", "glass", "cabbage",
	       "spider", "deep", "silver", "bar","long"];
//questions
var questions = ["Falling. Actor. Dust.", "Call. Pay. Line.",
		 "End. Burning. Blue.", "Man. Hot. Sure.",
		 "Stick. Hair. Ball.", "Blue. Cake. Cottage.",
		 "Man. Wheel. High.", "Motion. Poke. Down.",
		 "Line. Birthday. Surprise.", "Wood. Liquor. Luck.",
		 "House. Village. Golf.", "Plan. Show. Walker.",
		 "Key. Wall. Precious.", "Bell. Iron. Tender.",
		 "Water. Pen. Soda.", "Base. Snow. Dance.",
		 "Steady. Cart. Slow.", "Up. Book. Charge.",
		 "Broken. Clear. Eye.", "Skunk. Kings. Boil.",
		 "Widow. Bite. Monkey.", "Bass. Complex. Sleep.",
		 "Coin. Quick. Spoon.", "Gold. Stool. Tender.",
		 "Stretch. Hair. Time."];

var shapesLayer = new Kinetic.Layer();

function confirmation(boxnumber, box){
    var x;
    var answer=prompt(questions[boxnumber]);
    if (name!=null)
    {
	if (answer == answers[boxnumber]){
	    total = total+1;
	    right = right+1;
	    sessionColor = (right/total)*300;
	    
	    //socket.io input
	    hsl[boxnumber] = hsl[boxnumber] + 25;
	    box.setFill("hsl("+hsl[boxnumber]+",50%, 50%)");
	  
	    myRightOrWrongBox.setFill("hsl(300,50%,50%)");
	    myPersonalAverageBox.setFill("hsl("+sessionColor+",50%,50%)");
	    socket.emit('my other event', { my: boxnumber+" right" });
	}
	else{
	    total = total+1;
	    sessionColor = (right/total)*300;

	    //socket.io input
	    hsl[boxnumber] = hsl[boxnumber] - 25;
	    box.setFill("hsl("+hsl[boxnumber]+",50%, 50%)");

	    myRightOrWrongBox.setFill("hsl(0,50%,50%)");
	    myPersonalAverageBox.setFill("hsl("+sessionColor+",50%,50%)");
	    socket.emit('my other event', { my: boxnumber+" wrong "+answers[boxnumber] });
	}
	shapesLayer.draw();
    }
}

function averageBoxColor(){
    var average = 0;
    for(var i = 0; i<hsl.length; i++){
	average = average + hsl[i];
    }
    average = (average/hsl.length);
    average = "hsl(" + average + ",50%,50%)";
    myAverageBox.setFill(average);
}

/*
 * create a group which will be used to combine
 * multiple simple shapes.  Transforming the group will
 * transform all of the simple shapes together as
 * one unit
 */

var group = new Kinetic.Group({
    x: 5,
    y: 5,
    rotationDeg: 0
});

//aggregate tracker
var hsl = [];

//box tracker
var boxes = [];

var myRightOrWrongBox = new Kinetic.Rect({
    x: 530,
    y: 455,
    width: 50,
    height: 50,
    stroke: '#D3D3D3',
    strokeWidth: .9,
});

var myAverageBox = new Kinetic.Rect({
    x: 530,
    y: 395,
    width: 50,
    height: 50,
    stroke: '#D3D3D3',
    strokeWidth: .9,
});

var myPersonalAverageBox = new Kinetic.Rect({
    x: 530,
    y: 335,
    width: 50,
    height: 50,
    stroke: '#D3D3D3',
    strokeWidth: .9,
});

var linearGradRect = new Kinetic.Rect({
    x: 5,
    y: 510,
    width: 500,
    height: 25,
    fillLinearGradientStartPoint: [5, 500],
    fillLinearGradientEndPoint: [505, 500],
    fillLinearGradientColorStops: [0, "hsl(0,50%,50%)", .1, "hsl(30,50%,50%)", 
				   .2, "hsl(60,50%,50%)", .3, "hsl(90,50%,50%)", 
				   .4, "hsl(120,50%,50%)", .5, "hsl(150,50%,50%)", 
				   .6, "hsl(180,50%,50%)", .7, "hsl(210,50%,50%)",
				   .8, "hsl(240,50%,50%)", .9, "hsl(270,50%,50%)", 
				   1, "hsl(300,50%,50%)"], 
}); 


for(var n = 0; n < sidelength; n++) {
    for(var k = 0; k< sidelength; k++){
        // anonymous function to induce scope
        (function() {
	    //colortrack needs to be the socket.io emit from database
	    colortrack = colortrack;
	    var colorset = "hsl(" + colortrack + ",50%,50%)";
	    var box = new Kinetic.Rect({
		x: n * (500/sidelength),
		y: k * (500/sidelength),
		width: (500/sidelength),
		height: (500/sidelength),
		id: boxstring,
		fill: colorset,
	    });
	    boxes[boxstring] = box;
	    hsl[boxstring] = colortrack;
	    boxstring++;
	    box.on('mousedown', function() {
		averageBoxColor();		
		shapesLayer.draw();
		confirmation(this.getId(), this);
	    });

      box.on('mouseover', function() {
        this.setOpacity(0.9);
        shapesLayer.draw();
      });

      box.on('mouseout', function() {
        this.setOpacity(1.0);
        shapesLayer.draw();
      });

	    group.add(box);
        })();
    }
}

shapesLayer.add(group);
shapesLayer.add(myRightOrWrongBox);
shapesLayer.add(myAverageBox);
shapesLayer.add(myPersonalAverageBox);
shapesLayer.add(linearGradRect);
shapesLayer.draw();
stage.add(shapesLayer);
stage.draw();
