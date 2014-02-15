var ctx;
/*
	rocket object
		x:
		y:
		endX:
		endY:
		angle:
		
*/
var rockets = []; // contains all outstanding rockets in the air

/*
	explosion object
		x:
		y:
		angle:
		speed:
*/
var explosions = []; // contains all explosions from rockets
var mouseIsDown = false;
var mouseIsMoving = false;
var launchGap = 300; 
var waitingForLaunch = false;
var gravity = 2;
var rocketLength = 20;
var rocketSpeed = 1.6;
var rocketsFired = 0;
var launchIntervalMSM;
var globalMousePosition = new Object();


function setCanvasBg(){
	ctx.fillStyle = '#000000';
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

function onWindowResize(){
	var image = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
	ctx = document.getElementById('main_canvas').getContext('2d');
	ctx.canvas.width = window.innerWidth ;
	ctx.canvas.height = window.innerHeight ;
	ctx.putImageData(image,0,0);
}

function initCanvas(){
	ctx = document.getElementById('main_canvas').getContext('2d');
	ctx.canvas.width = window.innerWidth ;
	ctx.canvas.height = window.innerHeight ;
	
	// draw black bg for now
	setCanvasBg();
}

function setEventHandlers(){
	ctx.canvas.addEventListener('mousedown',onMouseDown,false);
	ctx.canvas.addEventListener('mousemove',onMouseMove,false);
	ctx.canvas.addEventListener('mouseup',onMouseUp,false);
	ctx.canvas.addEventListener('contextmenu',onRightClick,false);
	window.addEventListener('resize',onWindowResize);
}

function fireRockets(){
	if (!mouseIsDown) return;
	fireRocketTo(globalMousePosition.x, globalMousePosition.y);
}

function onMouseDown(e){
	e.preventDefault(); // so cursor doesnt change to text selection I
	fireRocketTo(globalMousePosition.x, globalMousePosition.y);
	/*
	if (mouseIsDown) return false;
	mouseIsDown = true;
	fireRocketTo(e.clientX, e.clientY);
	// if mouse continues to be down, keep sending rockets
	launchIntervalMD = setInterval(function(){
		fireRocketTo(e.clientX, e.clientY);
	},launchGap);
	*/
	mouseIsDown = true;
}

function onMouseMove(e){
	globalMousePosition.x = e.clientX;
	globalMousePosition.y = e.clientY;
	/*
	if (!mouseIsDown || waitingForLaunch) return;
	mouseIsMoving = true;
	clearInterval(launchIntervalMD); // clear this interval set earlier onMouseDown, otherwise rockets will be fired in the same direction
	clearInterval(launchIntervalMSM);
	waitingForLaunch = true;
	launchIntervalMM = setTimeout(function(){
		fireRocketTo(globalMousePosition.x, globalMousePosition.y);
		waitingForLaunch = false;
		mouseIsMoving = false;
	},launchGap);
	setTimeout(function(){
		if (!mouseIsMoving) // this case if mouse moved and stopped moving, want to keep firing rockets
			launchIntervalMSM = setInterval(function(){ 
				fireRocketTo(globalMousePosition.x, globalMousePosition.y);
			},launchGap);
	},1.1*launchGap);
	*/
}

function fireRocketTo(mX,mY){
	var rocketOriginX = ctx.canvas.width/2;
	var angle = Math.atan((ctx.canvas.height - mY)/(mX - rocketOriginX));
	if (angle <= 0)
		angle = angle + Math.PI;
	rockets.push({"x":rocketOriginX, "y":ctx.canvas.height, "endX":mX, "endY":mY, "angle":angle, "rocketLength":rocketLength, "speed":rocketSpeed});
	rocketsFired++;
	$('#rocket_count').text(rocketsFired);
}

function onMouseUp(e){
	// clearInterval(launchIntervalMD);
	// clearInterval(launchIntervalMM);
	// clearInterval(launchIntervalMSM);
	waitingForLaunch = false;
	mouseIsDown = false;
}

function onRightClick(e){
	e.preventDefault();
}

function renderRockets(){
	for (var i = 0; i < rockets.length; i++){
		ctx.beginPath();
		ctx.moveTo(rockets[i].x,rockets[i].y);
		
		var changeX = rockets[i].rocketLength * Math.cos(rockets[i].angle);
		var changeY = rockets[i].rocketLength * Math.sin(rockets[i].angle)
		ctx.lineTo(rockets[i].x + changeX, rockets[i].y - changeY);
		ctx.closePath();
		ctx.strokeStyle = '#00FF00';
		ctx.stroke();
		
		rockets[i].x += changeX * rockets[i].speed;
		rockets[i].y -= changeY * rockets[i].speed;
		rockets[i].speed = (1.1-rockets[i].endY / rockets[i].y + (Math.abs(rockets[i].endX - rockets[i].x)/ctx.canvas.width)*2)*rocketSpeed; // reduce rocket speed, simulate gravity
		
		// if reached end point, remove this rocket
		if (rockets[i].y <= rockets[i].endY  ){
			// before we remove it, we need to add explosions around where this rocket ends
			var explosionAngle;
			var explosionSpeed;
			var explosionLength;
			var explosionCount = Math.floor(Math.random() * 8) + 10; // between 7 and 14
			
			for (var iXplosion = 0; iXplosion < explosionCount; iXplosion++) { // produce explosions
			
				var explosionAngle = Math.random() * Math.PI * 2; 
				var explosionSpeed = 0.5;
				var explosionLength = Math.floor(Math.random() * 100) + 50; // between 50 and 150
				var explosionColor = get_random_color();
				explosions.push({"x":rockets[i].x, "y":rockets[i].y, "angle":explosionAngle, "speed":explosionSpeed, "length":explosionLength, "color":explosionColor});
			}
			rockets.splice(i,1);
		}
	}
}

function renderExplosions(){
	for (var i = 0; i < explosions.length; i++){
		// draw the explosion
		ctx. beginPath();
		ctx.moveTo(explosions[i].x, explosions[i].y);
		var changeX = explosions[i].length * Math.cos(explosions[i].angle);
		var changeY = explosions[i].length * Math.sin(explosions[i].angle);
		ctx.lineTo(explosions[i].x + changeX * explosions[i].speed, explosions[i].y + changeY * explosions[i].speed);
		ctx.closePath();
		if (explosions[i].length <= 3)
			ctx.strokeStyle = get_random_color(); // sparkly effect
		else
			ctx.strokeStyle = explosions[i].color;
		ctx.stroke();
		
		// update position based on speed
		explosions[i].x += changeX * explosions[i].speed;
		explosions[i].y += changeY * explosions[i].speed;
		explosions[i].y += gravity;
		explosions[i].speed = explosions[i].speed / 1.001; // half the speed every time drawn
		explosions[i].length /= 1.2;
		
		if (explosions[i].angle > Math.PI/2 && explosions[i].angle < 3*Math.PI/2) // left half
			explosions[i].angle -= 0.1;
		else // right half
			explosions[i].angle += 0.1;
		
		// if no speed left, delete this explosion 
		if (explosions[i].speed < 0.001){
			explosions.splice(i,1);
		}
	}
}

window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
			window.setTimeout(callback, 1000 / 60);
        };
})();

function animate(){
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
	setCanvasBg();
	renderRockets();
	renderExplosions();
	
	requestAnimFrame(function(){
		animate();
	});
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function setCookie(cname,cvalue,exdays){
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) 
	  {
	  var c = ca[i].trim();
	  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	  }
	return "";
}

function loadProgress(){
	rocketsFired = getCookie("rocketsFired");
	rocketsFired = rocketsFired?parseInt(rocketsFired):0;
	$('#rocket_count').text(rocketsFired);
}

function saveProgress(){
	setCookie('rocketsFired',rocketsFired.toString(),30);
}

$(document).ready(function(){
	initCanvas();
	loadProgress();
	setEventHandlers();
	saveprogressInterval = setInterval(saveProgress,10000);
	fireInterval = setInterval(fireRockets, launchGap);
	animate();
});

