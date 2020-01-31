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

class Bot {
	constructor(x, y){
		this.position_x = x;
		this.maxVelx = 3;
		this.maxVely = 3;
		this.position_y = y;
		this.velx = 0;
		this.vely = 0;
		this.accx = 0;
		this.accy = 0;
	}

	move(width, height){
		//change velocity 
		this.vely += this.accy;
		this.velx += this.accx;

		//handle max velocity
		if(this.vely > this.maxVely && this.vely > 0){
			this.vely = this.maxVely;
		}
		if(this.vely < -this.maxVely && this.vely < 0){
			this.vely = -this.maxVely;
		}
		if(this.velx > this.maxVelx && this.velx > 0){
			this.velx = this.maxVelx;
		}
		if(this.velx < -this.maxVelx && this.velx < 0){
			this.velx = -this.maxVelx;
		}

		//change position.
		this.position_y += this.vely;
		this.position_x += this.velx;

		//calculate edges
		if (this.position_x > width){
			this.position_x = 0;
		}
		if (this.position_x < 0){
			this.position_x = width;
		}
		if (this.position_y > height){
			this.position_y = 0;
		}
		if (this.position_y < 0){
			this.position_y = height;
		}
		//reset cycle acceleration
		this.accx = 0;
		this.accy = 0;
	}

	posBot(){
		return [this.position_x, this.position_y];
	}
	velBot(){
		return [this.velx, this.vely];
	}

	vel(x, y){
		this.velx = x;
		this.vely = y;
	}

	acc(x, y){
		this.accx += x;
		this.accy += y;
	}
}

class TeamBot extends Bot {
	constructor(x, y, team, teamid){
		super(x, y);
		this.team = team;
		this.teamid = teamid;
		if (this.teamid == 3){
			this.maxVelx = 4;
			this.maxVely = 4;
		}
	}

	changeTeam(team, tcolor){
		this.teamid = team;
		this.team = tcolor;
	}

	getTeamID(){
		return this.teamid;
	}

	draw(ctx){
		//draw bot
		ctx.fillStyle = this.team;
		if(this.velx >= 0 && this.vely <= 0) {
			ctx.beginPath();
			ctx.strokeStyle = this.team;
			ctx.moveTo(this.position_x+5, this.position_y+5);
			ctx.lineTo((this.position_x + this.velx*5), (this.position_y + this.vely*5));
			ctx.lineTo(this.position_x-5, this.position_y-5);
			ctx.closePath();
			ctx.stroke();
		} else if(this.velx <= 0 && this.vely >= 0) {
			ctx.beginPath();
			ctx.strokeStyle = this.team;
			ctx.moveTo(this.position_x-5, this.position_y-5);
			ctx.lineTo((this.position_x + this.velx*5), (this.position_y + this.vely*5));
			ctx.lineTo(this.position_x+5, this.position_y+5);
			ctx.closePath();
			ctx.stroke();
		} else if(this.velx <= 0 && this.vely <= 0) {
			ctx.beginPath();
			ctx.strokeStyle = this.team;
			ctx.moveTo(this.position_x+5, this.position_y-5);
			ctx.lineTo((this.position_x + this.velx*5), (this.position_y + this.vely*5));
			ctx.lineTo(this.position_x-5, this.position_y+5);
			ctx.closePath();
			ctx.stroke();
		} else if(this.velx <= 0 && this.vely >= 0) {
			ctx.beginPath();
			ctx.strokeStyle = this.team;
			ctx.moveTo(this.position_x+5, this.position_y-5);
			ctx.lineTo((this.position_x + this.velx*5), (this.position_y + this.vely*5));
			ctx.lineTo(this.position_x-5, this.position_y+5);
			ctx.closePath();
			ctx.stroke();
		} else if(this.velx >= 0 && this.vely >= 0) {
			ctx.beginPath();
			ctx.strokeStyle = this.team;
			ctx.moveTo(this.position_x+5, this.position_y-5);
			ctx.lineTo((this.position_x + this.velx*5), (this.position_y + this.vely*5));
			ctx.lineTo(this.position_x-5, this.position_y+5);
			ctx.closePath();
			ctx.stroke();
		}
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = this.team;
		ctx.arc(this.position_x, this.position_y, 7, 0, 2*Math.PI);
		ctx.fill();
	}
	//draw vectors !Not acctual vectors
	drawDetails(ctx){
		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.moveTo(this.position_x, this.position_y);
		ctx.lineTo((this.position_x + this.accx*80), (this.position_y + this.accy*80));
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "yellow";
		ctx.moveTo(this.position_x, this.position_y);
		ctx.lineTo((this.position_x + this.velx*20), (this.position_y + this.vely*20));
		ctx.stroke();
	}
	//fleeMouse, same as flee, but from the mouse x, y coordiantes.
	fleeMouse(mouse_x,mouse_y){
		var perception = 60;
		var avg_vector = [0, 0];
		var botxy = [this.position_x, this.position_y];
		var distance_vector = [botxy[0]-mouse_x, botxy[1]-mouse_y];
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");
		var distance = Math.floor(Math.sqrt( distance_vector[0]*distance_vector[0] + distance_vector[1]*distance_vector[1]));
		if(distance < perception){

			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.moveTo(mouse_x, mouse_y);
			ctx.lineTo((botxy[0]), (botxy[1]));
			ctx.stroke();

			var temp_x = -(mouse_x-botxy[0]);
			var temp_y = -(mouse_y-botxy[1]);
			avg_vector = [avg_vector[0]+temp_x, avg_vector[1]+temp_y];
		}

		if (true){
			avg_vector = [(avg_vector[0]), (avg_vector[1])];
			this.acc(avg_vector[0]*10, avg_vector[1]*10);
		}

	}

	/* Align, get the average velocity vector from bots in the perception radius. Then create acceleration vector from the average one, 1/35
	*/
	align(bots, doFormation, ctx){
		//align
		var Aperception = 60;
		var align_avg_vector = [0,0];
		var botxy = [this.position_x, this.position_y];
		var Atotal = 1;

		//flee
		var Fperception = 30;
		var flee_avg_vector = [0,0];
		var Ftotal = 1;

		//seperate
		var Sperception = 20;
		var sep_avg_vector = [0,0];
		var Stotal = 1;

		//cohesion
		var Cperception = 80;
		var Ctotal = 1;
		var coh_avg_vector = [this.position_x, this.position_y];

		for (var p = 0; p < bots.length; p++) {
			if(this != bots[p]){
				var next_botxy = bots[p].posBot();
				var distance_vector = [botxy[0]-next_botxy[0], botxy[1]-next_botxy[1]]

				var distance = Math.floor(Math.sqrt( distance_vector[0]*distance_vector[0] + distance_vector[1]*distance_vector[1]));
				//align
				if((this.teamid == bots[p].getTeamID() && this.teamid != 3) && (distance < Aperception)){
					align_avg_vector = [align_avg_vector[0]+bots[p].velBot()[0], align_avg_vector[1]+bots[p].velBot()[1]];
					Atotal++;
				}
				//flee
				if((this.teamid == 3 && bots[p].getTeamID() != 3) && distance < 15){
						bots[p].changeTeam(this.teamid, this.team);
						console.log("test");
						return;
					}
				if((this.teamid != bots[p].getTeamID()) && (distance < Fperception) && this.teamid != 3){
					var temp_x = -(bots[p].posBot()[0]-botxy[0]);
					var temp_y = -(bots[p].posBot()[1]-botxy[1]);

					flee_avg_vector = [flee_avg_vector[0]+temp_x, flee_avg_vector[1]+temp_y];
					Ftotal++;
				}
				//seperate
				if((this.teamid == bots[p].getTeamID()) && (distance < Sperception)){
					var temp_x = -(bots[p].posBot()[0]-botxy[0]);
					var temp_y = -(bots[p].posBot()[1]-botxy[1]);

					sep_avg_vector = [sep_avg_vector[0]+temp_x, sep_avg_vector[1]+temp_y];
					Stotal++;
				}
				//cohesion
				if(((this.teamid == bots[p].getTeamID() && bots[p].getTeamID() != 3)) && (distance < Cperception) && (distance > 30)){
					coh_avg_vector = [coh_avg_vector[0]+bots[p].posBot()[0], coh_avg_vector[1]+bots[p].posBot()[1]];
					Ctotal++;
				}
				if(((this.teamid == 3 && bots[p].getTeamID() != 3)) && (distance < Cperception) && (distance > 30)){
					coh_avg_vector = [coh_avg_vector[0]+bots[p].posBot()[0], coh_avg_vector[1]+bots[p].posBot()[1]];
					Ctotal++;
				}
				//formation
				if(doFormation){
					if((this.teamid == bots[p].getTeamID()) && (distance < Cperception)){
						ctx.beginPath();
						ctx.strokeStyle = "light"+this.team;
						ctx.moveTo(this.position_x, this.position_y);
						ctx.lineTo((next_botxy[0]), (next_botxy[1]));
						ctx.stroke();
					}
				}
			}
		}
		//align
		if (Atotal > 1 && Atotal < 8){
			if(this.teamid == 3){
				align_avg_vector = [(align_avg_vector[0]/Atotal), (align_avg_vector[1]/Atotal)];
				this.acc(avg_vector[0], avg_vector[1]);
			} else {
				align_avg_vector = [(align_avg_vector[0]/Atotal), (align_avg_vector[1]/Atotal)];
				this.acc(align_avg_vector[0]/35, align_avg_vector[1]/35);//25
			}
		}
		//Flee
		if (Ftotal > 1){
			flee_avg_vector = [(flee_avg_vector[0]/Ftotal), (flee_avg_vector[1]/Ftotal)];
			this.acc(flee_avg_vector[0]/5, flee_avg_vector[1]/5);
		}
		//seperate
		if (Stotal > 1){
			if(this.teamid ==3){
				sep_avg_vector = [(sep_avg_vector[0]/Stotal), (sep_avg_vector[1]/Stotal)];
				this.acc(sep_avg_vector[0], sep_avg_vector[1]);
			} else {
				sep_avg_vector = [(sep_avg_vector[0]/Stotal), (sep_avg_vector[1]/Stotal)];
				this.acc(sep_avg_vector[0]/25, sep_avg_vector[1]/25);
			}
		}
		//cohesion
		if (Ctotal > 1 && Ctotal < 7){
			if(this.teamid ==3){
				coh_avg_vector = [(coh_avg_vector[0]/Ctotal)-botxy[0], (coh_avg_vector[1]/Ctotal)-botxy[1]];
				this.acc(coh_avg_vector[0]/10, coh_avg_vector[1]/10);
			} else {
				coh_avg_vector = [(coh_avg_vector[0]/Ctotal)-botxy[0], (coh_avg_vector[1]/Ctotal)-botxy[1]];
				this.acc(coh_avg_vector[0]/180, coh_avg_vector[1]/180);//150
			}

		}
	}

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
		bot1 = new TeamBot(x, y, "red", 3);
		var velx = Math.floor(Math.random() * 10)-5;
		var vely = Math.floor(Math.random() * 10)-5;
		bot1.vel(velx, vely);
		bots.push(bot1);
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