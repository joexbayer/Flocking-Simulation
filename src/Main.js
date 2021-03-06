var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var infoBox = document.getElementById("detailsInfoBox");
var fleebutton = document.getElementById("fleem");
var rezMouse = document.getElementById("resizeMouse");
var detMouse = document.getElementById("detailsMouse");
var forMouse = document.getElementById("formationMouse");
canvas.width = document.body.clientWidth*0.80; //document.width is obsolete
canvas.height = document.body.clientHeight*0.90; //document.height is obsolete

var screen_width = canvas.width;
var screen_height = canvas.height;
var bots = [];
var fleeMouse = false;
var resizeMouse = false;
var showDetails = false;
var showFormation = false;


//slider handler
var slider = document.getElementById("myRange");
var output = document.getElementById("svalue");
output.innerHTML = "Cohesion: "+(100-slider.value)+"%";
slider.style.backgroundSize =slider.value+"% 100%";

slider.oninput = function() {
	output.innerHTML = "Cohesion: "+(100-slider.value)+"%";
	slider.style.backgroundSize =slider.value+"% 100%";
}
var slider1 = document.getElementById("myRange1");
var output2 = document.getElementById("svalue1");
output2.innerHTML = "Align: "+(100-slider1.value)+"%"; 
slider1.style.backgroundSize =slider1.value+"% 100%";

slider1.oninput = function() {
	output2.innerHTML = "Align: "+(100-slider1.value)+"%";
	slider1.style.backgroundSize =slider1.value+"% 100%";
}

var slider2 = document.getElementById("myRange2");
var output3 = document.getElementById("svalue2");
output3.innerHTML = "Seperation: "+(100-slider2.value)+"%"; 
slider2.style.backgroundSize =slider2.value+"% 100%";

slider2.oninput = function() {
	output3.innerHTML = "Seperation: "+(100-slider2.value)+"%";
	slider2.style.backgroundSize =slider2.value+"% 100%";
}

//setup function for teams
function setup(e){
	if (e == 1){
		for (var i = 0; i < 100; i++) {
			var posx = Math.floor(Math.random() * screen_width);
			var posy = Math.floor(Math.random() * screen_height);
			bot1 = new TeamBot(posx, posy, "blue", 2);

			var velx = Math.floor(Math.random() * 10)-5;
			var vely = Math.floor(Math.random() * 10)-5;
			bot1.vel(velx, vely);
			bots.push(bot1);
		}
	} else if (e == 2){
		for (var i = 0; i < 100; i++) {
			var posx = Math.floor(Math.random() * screen_width);
			var posy = Math.floor(Math.random() * screen_height);
			bot1 = new TeamBot(posx, posy, "yellow", 4);

			var velx = Math.floor(Math.random() * 10)-5;
			var vely = Math.floor(Math.random() * 10)-5;
			bot1.vel(velx, vely);
			bots.push(bot1);
		}
		for (var i = 0; i < 100; i++) {
			var posx = Math.floor(Math.random() * screen_width);
			var posy = Math.floor(Math.random() * screen_height);
			bot1 = new TeamBot(posx, posy, "green", 1);

			var velx = Math.floor(Math.random() * 10)-5;
			var vely = Math.floor(Math.random() * 10)-5;
			bot1.vel(velx, vely);
			bots.push(bot1);
			}
		}

}
//function handling Mouse movement.
function getPos(e){
	if (fleeMouse){
		x=e.clientX;
	    y=e.clientY;
    	for (var p = 0; p < bots.length; p++) {
    		bots[p].fleeMouse(x, y);
    	}
	}
}

function activateResize(){
	if(resizeMouse){
		resizeMouse = false;
		rezMouse.removeAttribute("style");
	} else {
		rezMouse.setAttribute("style", "background-image: linear-gradient(to right, #ffffff, red);");
		resizeMouse = true;
	}
}

function activateDetails(){
	if(showDetails){
		showDetails = false;
		detMouse.removeAttribute("style");
		infoBox.innerHTML = "";
	} else {
		detMouse.setAttribute("style", "background-image: linear-gradient(to right, #ffffff, red);");
		showDetails = true;
	}
}

function activateFleeMouse(){
	if(fleeMouse){
		fleeMouse = false;
		fleebutton.removeAttribute("style");
	} else {
		fleebutton.setAttribute("style", "background-image: linear-gradient(to right, #ffffff, red);");
		fleeMouse = true;
	}
}
function activateFormation(){
	if(showFormation){
		showFormation = false;
		forMouse.removeAttribute("style");
	} else {
		forMouse.setAttribute("style", "background-image: linear-gradient(to right, #ffffff, red);");
		showFormation = true;
	}
}

function clearScreen(){
	bots = [];
	slider.value = 90;
	slider1.value = 35;
	slider2.value = 25;
	output.innerHTML = "Cohesion: "+(100-slider.value)+"%";
	output2.innerHTML = "Align: "+(100-slider1.value)+"%";
	output3.innerHTML = "Seperation: "+(100-slider2.value)+"%";
	slider1.style.backgroundSize =slider1.value+"% 100%";
	slider.style.backgroundSize =slider.value+"% 100%";
	slider2.style.backgroundSize =slider2.value+"% 100%";
}
//function handling mouseClick
function mouseClick(e){
	x=e.clientX;
	y=e.clientY;
	if(fleeMouse) {
		if(x<screen_width && y<screen_height){
			bot1 = new TeamBot(x, y, "red", 3);
			var velx = Math.floor(Math.random() * 10)-5;
			var vely = Math.floor(Math.random() * 10)-5;
			bot1.vel(velx, vely);
			bots.push(bot1);
		}
	} else {
		if(x<screen_width && y<screen_height){
			bot1 = new TeamBot(x, y, "white", 5);
			var velx = Math.floor(Math.random() * 10)-5;
			var vely = Math.floor(Math.random() * 10)-5;
			bot1.vel(velx, vely);
			bots.push(bot1);
		}
	}
}


//update function running rules.
setInterval(function update(){
	if(canvas.width != document.body.clientWidth*0.80 || canvas.height != document.body.clientHeight*0.85){
		canvas.width = document.body.clientWidth*0.80; //document.width is obsolete
		canvas.height = document.body.clientHeight*0.90; //document.height is obsolete

		screen_width = canvas.width;
		screen_height = canvas.height;
	}

	ctx.fillStyle = "#212121";
	ctx.fillRect(0, 0, screen_width, screen_height);
	var totalHunter = 0;

	for (var p = 0; p < bots.length; p++) {
		if(bots[p].getTeamID() == 3){
			totalHunter++;
		}
		if (showDetails){
			infoBox.innerHTML = " Details: Bots = "+bots.length+". Hunters = "+totalHunter+". Frames: 33,3. Yellow Vector: Velocity. Red Vector: Acceleration";
			bots[p].drawDetails(ctx);
		}
		bots[p].draw(ctx, resizeMouse);
		bots[p].move(screen_width, screen_height);
		bots[p].align(bots, showFormation, ctx, slider.value*2, slider1.value, slider2.value);
	}
}, 30);