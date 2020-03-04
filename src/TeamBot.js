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

	draw(ctx, bodyOptions){
		//draw bot
		ctx.save();
		ctx.translate(this.position_x, this.position_y);
		var angle = -90+Math.atan2(this.vely, this.velx) * 180 / Math.PI;
		ctx.rotate(angle*Math.PI/180);
		ctx.beginPath();
		ctx.strokeStyle = this.team;
		ctx.fillStyle = this.team;
	    ctx.moveTo(0,0);
	    ctx.lineTo(-7, 0);
	    ctx.lineTo(0, 20);
	    ctx.lineTo(7, 0); 
	   	ctx.fill(); 
		ctx.closePath();
		ctx.stroke();
	    ctx.restore();

	    if(!bodyOptions){
	    	ctx.beginPath();
			ctx.fillStyle = this.team;
			ctx.arc(this.position_x, this.position_y, 7, 0, 2*Math.PI);
			ctx.fill();
	    }
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
	align(bots, doFormation, ctx, cohesionfactor, alignfactor, seperatefactor){
		//align
		if(alignfactor == 100){
			alignfactor = 1000000;
		}
		if(seperatefactor == 100){
			alignfactor = 1000000;
		}
		if(cohesionfactor == 300){
			alignfactor = 1000000;
		}
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
						if(this.team == "red"){
							ctx.strokeStyle = "black";
						} else {
							ctx.strokeStyle = "light"+this.team;
						}
						ctx.beginPath();
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
				this.acc(align_avg_vector[0]/alignfactor, align_avg_vector[1]/alignfactor);//25
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
				this.acc(sep_avg_vector[0]/seperatefactor, sep_avg_vector[1]/seperatefactor);//25
			}
		}
		//cohesion
		if (Ctotal > 1 && Ctotal < 7){
			if(this.teamid ==3){
				coh_avg_vector = [(coh_avg_vector[0]/Ctotal)-botxy[0], (coh_avg_vector[1]/Ctotal)-botxy[1]];
				this.acc(coh_avg_vector[0]/10, coh_avg_vector[1]/10);
			} else {
				coh_avg_vector = [(coh_avg_vector[0]/Ctotal)-botxy[0], (coh_avg_vector[1]/Ctotal)-botxy[1]];
				this.acc(coh_avg_vector[0]/cohesionfactor, coh_avg_vector[1]/cohesionfactor);//180
			}

		}
	}

}