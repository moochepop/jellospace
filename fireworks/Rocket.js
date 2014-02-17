function Rocket (startX, startY, endX, endY){
	this.x = startX;
	this.y = startY;
	
	this.startX = startX;
	this.startY = startY;
	
	this.endX = endX;
	this.endY = endY;
	
	this.distanceToEnd = distance(startX, startY, endX, endY);
	this.distanceTravelled = 0;
	
	/*	Track the past coordinates of each rocket to create a trail effect
		increase the coordinate count to create more prominent trails */
	this.coords= [];
	this.coordCount = 3;
	
	/*  Populate initial coordinates collection with he current coordinates */
	for (var i = 0; i < this.coordCount; i++) {
		this.coords.push([this.x,this.y]);
	}
	
	this.angle = Math.atan2( endY - startY, endX - startX);
	this.speed = distance(startX, startY, endX, endY)/16;
	this.acceleration = 0.95;
	this.hue = random(0,360);
	this.brightness = 60;
	
}

Rocket.prototype.update = function(index){
	// Remove last item in coords array
	this.coords.pop();
	// Add current coords to the start of array
	this. coords.unshift([this.x, this.y]);
	
	// Apply acceleration
	this.speed *= this.acceleration; 
	
	// Calculate current velocity
	var vx = Math.cos(this.angle) * this.speed;
	var vy = Math.sin(this.angle) * this.speed;
	
	this.distanceTravelled = distance(this.startX, this.startY, this.x + vx, this.y + vy);
	
	if (this.distanceTravelled >= this.distanceToEnd) { // got to the target
		createExplosions( this.endX, this.endY, this.hue);
		rockets.splice(index, 1);
	}
	else { // continue towards target
		this.x += vx;
		this.y += vy;
	}
}

Rocket.prototype.render = function(){
	ctx.beginPath();
	ctx.moveTo( this.coords[ this.coords.length - 1][0], this.coords[this.coords.length - 1][1]);
	ctx.lineTo( this.x, this.y);
	ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, ' + this.brightness + '%)';
	ctx.lineWidth = 1;
	ctx.stroke();
	
}

function createExplosions(x , y, rocketHue){
	var num_explosions = 30;
	for(var i = 0; i < num_explosions; i++){
		explosions.push(new Explosion(x,y,rocketHue));
	}
}














