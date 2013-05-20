$(function(){
	$("body").css("width", window.innerWidth);
	$("body").css("height", window.innerHeight);
	
	currentcanvas  = document.getElementById("gameCanvas");
	currentcontext = currentcanvas.getContext('2d');
	
	currentgame = new JezzBallGame();
	currentgame.newGame();
});
