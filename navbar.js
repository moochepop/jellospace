$(document).ready(function(){
	var items = 
	'	<h2>Speed Card Game</h2>\
		<a href="http://individual.utoronto.ca/jerryshe/speed/speed.htm">Play! (Firefox)</a>\
		<a href="http://individual.utoronto.ca/jerryshe/speed/instructions.htm">Instructions</a>\
		<h2>OMG Chat!</h2>\
		<a href="http://jello.webatu.com/chat/chat.htm">Chatroom</a>\
		<h2>Fireworks</h2>\
		<a href="http://individual.utoronto.ca/jerryshe/fireworks/fireworks.htm">Light up the sky</a>\
		<h2>Side Dishes</h2>\
		<a href="http://individual.utoronto.ca/jerryshe/sides/snow.htm">Snow</a>\
		<h2>Updates</h2>\
		<a href="http://individual.utoronto.ca/jerryshe/updates/progress.htm">Progress</a>\
		<a href="http://individual.utoronto.ca/jerryshe/updates/nexts.htm">Nexts</a>\
		<h2>Miscellaneous</h2>\
		<a href="http://individual.utoronto.ca/jerryshe/miscellaneous/doodles.htm">Doodles</a>';
	$('#navbar').append(items).slideUp(10).slideDown(500);
});