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