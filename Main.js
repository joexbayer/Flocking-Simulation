var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var infoBox = document.getElementById("detailsInfoBox");
var fleebutton = document.getElementById("fleem");
var rezMouse = document.getElementById("resizeMouse");
var detMouse = document.getElementById("detailsMouse");
var forMouse = document.getElementById("formationMouse");

var screen_width = canvas.width;
var screen_height = canvas.height;
var bots = [];
var fleeMouse = false;
var resizeMouse = false;
var showDetails = false;
var showFormation = false;

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
//function handling mouseClick
function mouseClick(e){
	x=e.clientX;
	y=e.clientY;
	if(resizeMouse){
		canvas.width = x;
		canvas.height = y;
		screen_width = x;
		screen_height = y;
	} else if(fleeMouse) {
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

//functions for activating features.
function activateRezise(){
	if(resizeMouse){
		resizeMouse = false
		rezMouse.removeAttribute("style");
	} else {
		rezMouse.setAttribute("style", "background-image: linear-gradient(to right, #ffffff, red);");
		resizeMouse = true;
	}
}

function activateDetails(){
	if(showDetails){
		showDetails = false
		detMouse.removeAttribute("style");
		infoBox.innerHTML = "";
	} else {
		detMouse.setAttribute("style", "background-image: linear-gradient(to right, #ffffff, red);");
		showDetails = true;
	}
}

function activateFleeMouse(){
	if(fleeMouse){
		fleeMouse = false
		fleebutton.removeAttribute("style");
	} else {
		fleebutton.setAttribute("style", "background-image: linear-gradient(to right, #ffffff, red);");
		fleeMouse = true;
	}
}
function activateFormation(){
	if(showFormation){
		showFormation = false
		forMouse.removeAttribute("style");
	} else {
		forMouse.setAttribute("style", "background-image: linear-gradient(to right, #ffffff, red);");
		showFormation = true;
	}
}

function clearScreen(){
	bots = []
}

//update function running rules.
setInterval(function update(){
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
		bots[p].draw(ctx);
		bots[p].move(screen_width, screen_height);
		bots[p].align(bots, showFormation, ctx);
	}
}, 30);