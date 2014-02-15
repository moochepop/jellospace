var rockets = [], // contains all outstanding rockets in the air
	explosions = [], // contains all explosions from rockets
	mouseIsDown = false,
	mouseX,
	mouseY,
	canvas,
	ctx,
	rocketsFired = 0;
	
	
function onMouseDown(e){
	e.preventDefault(); // so cursor doesnt change to text selection I
	//	fireRocketTo(globalMousePosition.x, globalMousePosition.y);
	mouseIsDown = true;
}

function onMouseMove(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
}

function onMouseUp(e){
	mouseIsDown = false;
}

function onRightClick(e){
	e.preventDefault();
}

function onWindowResize(){
	var image = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
	ctx = document.getElementById('main_canvas').getContext('2d');
	ctx.canvas.width = window.innerWidth ;
	ctx.canvas.height = window.innerHeight ;
	ctx.putImageData(image,0,0);
}
	
function setEventHandlers(){
	ctx.canvas.addEventListener('mousedown',onMouseDown,false);
	ctx.canvas.addEventListener('mousemove',onMouseMove,false);
	ctx.canvas.addEventListener('mouseup',onMouseUp,false);
	ctx.canvas.addEventListener('contextmenu',onRightClick,false);
	window.addEventListener('resize',onWindowResize);
}

function setCanvasBg(){
	ctx.fillStyle = '#000000';
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
}
	
function initCanvas(){
	ctx = document.getElementById('main_canvas').getContext('2d');
	ctx.canvas.width = window.innerWidth ;
	ctx.canvas.height = window.innerHeight ;
	
	// draw black bg for now
	setCanvasBg();
}
	
// get a random number within a range
function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

// calculate the distance between two points
function calculateDistance( x0, y0, x1, y1 ) {
	var dx = x0 - x1,
	var dy = y0 - y1;
	return Math.sqrt(dx * dx + dy * dy);
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
	//fireInterval = setInterval(fireRockets, launchGap);
	//animate();
});