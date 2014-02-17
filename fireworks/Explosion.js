function Explosion(x, y, rocketHue){
	this.x = x;
	this.y = y;
	
	this.coords = [];
	this.coordCount = 5;
	for (var i = 0; i < this.coordCount; i++){
		this.coords.push([this.x, this.y]);
	}
	
	this.angle = random(0, Math.PI * 2);
	this.speed = random(5,15);
	this.deceleration = 0.95;
	this.gravity = 1;
	
	this.hue = random(rocketHue - 20, rocketHue + 20);
	this.brightness = random(50,80);
	this.alpha = 1;
	
	this.fadeRate = random(0.015,0.03);
}

Explosion.prototype.update = function ( index ){
	// Remove last item in coords array
	this.coords.pop();
	
	this.coords.unshift([this.x,this.y]);
	this.speed *= this.deceleration;
	
	this.x += Math.cos(this.angle) * this.speed;
	this.y += Math.sin(this.angle) * this.speed + this.gravity;
	
	if (this.speed <= 1)
		this.alpha -= this.fadeRate;
	if( this.alpha <= this.fadeRate){
		explosions.splice(index ,1);
	}
}

Explosion.prototype.render = function(){
	ctx.beginPath();
	ctx.moveTo( this.coords[this.coords.length - 1][0], this.coords[this.coords.length - 1][1]);
	ctx.lineTo( this.x, this.y);
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	ctx.stroke();
}











