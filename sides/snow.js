var background = new Image();
background.src = 'snow_bg_s.jpg';
var alphaChange = -0.00001;
function initCanvas(){
	var ctx = document.getElementById('snow_canvas').getContext('2d');
	var cvWidth = ctx.canvas.width,
		cvHeight = ctx.canvas.height;
	var flakes = [];
	function addFlake(){
		var x = Math.floor(Math.random() * cvWidth) + 1;
		var y = 0;
		var s = Math.floor(Math.random() * 10) + 1;
		flakes.push({"x":x,"y":y,"s":s});
	}
	
	function snow(){
		addFlake();
		for(var iflake = 0; iflake < flakes.length; iflake++){
			ctx.fillStyle = "rgba(255,255,255,.75)";
			ctx.beginPath();
			ctx.arc(flakes[iflake].x, flakes[iflake].y += flakes[iflake].s * .25, flakes[iflake].s * .25, 0, Math.PI*2, false);
			ctx.fill();
			if(flakes[iflake].y > cvHeight){
				flakes.splice(iflake,1);
			}	
		}
	}
	
	function animate(){
		//ctx.save();
		ctx.clearRect(0,0,cvWidth,cvHeight);
		ctx.drawImage(background,0,0);
		ctx.globalAlpha += alphaChange;
		
		if (ctx.globalAlpha >= 0.2 && alphaChange == 0.000001){
			alphaChange = -0.00001;
			background.src = 'snow_bg_s.jpg';
		}
		else if (ctx.globalAlpha <= 0.1){
			background.src = 'dead.jpg';
			alphaChange = 0.000001;
		}
		snow();
		//ctx.restore();
	}
	var animateInterval = setInterval(animate, 30);
}

$(document).ready( initCanvas );
