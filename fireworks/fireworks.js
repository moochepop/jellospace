var rockets = [], // contains all outstanding rockets in the air
	explosions = [], // contains all explosions from rockets
	mouseIsDown = false,
	mouseX,
	mouseY,
	canvas,
	ctx,
	launchGap = 300,
	rocketsFired = 0,
	money = 0,
	rocketMultiplier = 1;
	rpanelOut = false;
	
/* 
	Fire a rocket to current mouseX and mouseY.
	Also handles increasing/updating score.
*/
function fireRocket(){ 
	rockets.push(new Rocket(canvas.width/2, canvas.height, mouseX, mouseY));
	rocketsFired += rocketMultiplier;
	$('#rocket_count').text(Math.round(rocketsFired));
	money += rocketMultiplier;
	$("#money").text(Math.floor(money/100));
}
	
function onMouseDown(e){
	e.preventDefault(); // so cursor doesnt change to text selection I
	fireRocket();
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
	fireRocket();
}

function onWindowResize(){
	var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx = document.getElementById('main_canvas').getContext('2d');
	canvas.width = window.innerWidth ;
	canvas.height = window.innerHeight ;
	ctx.putImageData(image,0,0);
}
	
function setEventHandlers(){
	canvas.addEventListener('mousedown',onMouseDown,false);
	canvas.addEventListener('mousemove',onMouseMove,false);
	canvas.addEventListener('mouseup',onMouseUp,false);
	canvas.addEventListener('contextmenu',onRightClick,false);
	window.addEventListener('resize',onWindowResize);
}

function setCanvasBg(){
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
	
function initCanvas(){
	canvas = document.getElementById('main_canvas');
	ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth ;
	canvas.height = window.innerHeight ;
	
	// draw black bg for now
	setCanvasBg();
}
	
// get a random number within a range
function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

// calculate the distance between two points
function distance( x0, y0, x1, y1 ) {
	var dx = x0 - x1;
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
	
	money = getCookie("money");
	money = money?parseInt(money):0;
	$('#money').text(money);
}

function saveProgress(){
	setCookie('rocketsFired',rocketsFired.toString(),30);
	var clone = $('#rocket_count').clone();
	clone.appendTo('#rocket_count').animate({fontSize:'72px',opacity:'0'},'swing',function(){
		clone.remove();
	});
}
	
window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
			window.setTimeout(callback, 1000 / 60);
        };
})();

function animate(){
	requestAnimFrame(animate);
	
	// clear the canvas, but leave some faint traces behind
//	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'rgba(0,0,0,0.5)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	for (var i = 0; i < rockets.length; i++){
		rockets[i].render();
		rockets[i].update();
	}
	for (var i = 0; i < explosions.length; i++){
		explosions[i].render();
		explosions[i].update();
	}
}

function fireRockets(){
	if (!mouseIsDown) return;
	fireRocket();
}

function TooltipSaveShow(){
	$('#tooltip_save').show();
}

function TooltipSaveHide(){
	$('#tooltip_save').hide();
}

$(document).ready(function(){
	initCanvas();
	loadProgress();
	setEventHandlers();
	saveprogressInterval = setInterval(saveProgress,10000);
	fireInterval = setInterval(fireRockets, launchGap);
	$('#rpanel').css({'opacity':0, 'height':0}); // want to initially hide this
	animate();
});