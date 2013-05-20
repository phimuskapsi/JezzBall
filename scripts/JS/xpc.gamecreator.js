var currentcanvas   = null;
var currentcontext 	= null;
var currentgame 	= null;
var currentgrid 	= null;

 function JezzBallGame() {
 	this.areacount		= 0;
	this.ballsize		= 0;
	this.ballspeed		= 0;
	this.currentarea	= 0;
	this.direction		= "vertical";
	this.gameareas		= null;
	this.gamelength 	= 0;
	this.lines			= null;
	this.lives			= 3;
	this.coveredwidth	= 0;
	this.currenttime 	= 0;
	this.currentlives 	= 0;
	this.currentscore 	= 0;
	this.currentpercent = 0.00;
	this.width			= 0;
	this.height 		= 0;
}

function JezzBallGameArea(x, y, w, h){
	this.ballcount  	= 0;
	this.ballsack		= null;

	this.endX			= w + x;
	this.endY			= w + y;

	this.startX			= x;
	this.startY			= y;
	
	this.height			= h;
	this.width			= w;
}

function JezzBallGrid(w, h, newR, newC, gs){
	this.width			= w;
	this.height 		= h;
	this.rows			= newR;
	this.columns		= newC;
	this.gridsize		= gs;
}

function JezzBallBall(ballsize, newX, newY, speed, id){
	this.ballsize			= ballsize;
	this.boundingbox		= { };
	this.curX				= newX + ballsize;
	this.curY				= newY + ballsize;
	this.position			= "";
	this.speedX				= speed;
	this.speedY				= speed;
	this.id					= id;
	
	this.boundingbox['x'] 	= this.curX - this.ballsize;
	this.boundingbox['y'] 	= this.curY - this.ballsize;
	this.boundingbox['w']	= this.ballsize * 2;
	this.boundingbox['h'] 	= this.ballsize * 2;
}

function JezzBallLine(startx, starty, height, width, area){
	this.curX			= startx;
	this.curY			= starty;
	this.endX			= 0;
	this.endY			= 0;
	this.hit			= false;
	this.speed			= 2;
	this.startX			= startx;
	this.startY			= starty;
	this.height			= height;
	this.width			= width;
	this.curheight		= height;
	this.curwidth		= width;
	
	this.ballside		= "";
	this.direction	 	= currentgame.direction;
	this.linedrawn		= false;
	this.drawnandfilled = false;
	
	this.bottomdone		= false;
	this.leftdone		= false;
	this.rightdone		= false;
	this.topdone		= false;
	
	if(currentgame.lines == null){
		currentgame.lines = { };
		currentgame.linecount = 0;
	}	
	
	currentgame.lines[currentgame.linecount] 	= { };
}

JezzBallBall.prototype.getPositionToLine = function(line){
	if(currentgame.direction == "vertical"){
		return ((this.curX < line.startX) ? 0 : (this.curX == line.startX) ? -1 : 1);
	} else {
		return ((this.curY < line.startY) ? 0 : (this.curY == line.startY) ? -1 : 1);
	}
}

JezzBallGame.prototype.createNewArea = function(area,line){
	var newarea = null	
	currentgame.areacount++;
	
	if(currentgame.direction == "vertical"){
		newarea = new JezzBallGameArea(line.endX, area.startY, (area.width - line.endX), area.height);
		area.width = line.startX;
		
		// Need to calc ballsack
		newarea.ballsack = { };
		var newcnt  = 0;
		for(var a=0;a<area.ballcount;a++){
			var ball = area.ballsack[a];
			
			if(ball.boundingbox['x'] >= newarea.startX && (ball.boundingbox['x'] + ball.boundingbox['w']) <= (newarea.startX + newarea.width)){
				newarea.ballsack[newcnt] = area.ballsack[a];
				delete area.ballsack[a]; 
				area.ballsack = renumberObject(area.ballsack);
				area.ballcount = Object.size(area.ballsack);
			}		
		}	
	} else { 
		newarea = new JezzBallGameArea(area.startX, line.endY, area.width, (area.height - line.endY));
		area.height = line.startY;
		
		// Need to calc ballsack
		newarea.ballsack = { };
		var newcnt  = 0;
		for(var b=0;b<area.ballcount;b++){
			var ball = area.ballsack[b];
			
			if(ball.boundingbox['y'] >= newarea.startY && (ball.boundingbox['y'] + ball.boundingbox['h']) <= newarea.height){
				newarea.ballsack[newcnt] = area.ballsack[b];
				newcnt++;
				delete area.ballsack[b]; 
				area.ballsack = renumberObject(area.ballsack);
				area.ballcount = Object.size(area.ballsack);
			}		
		}
	}

	newarea.ballcount = Object.size(newarea.ballsack);
	currentgame.gameareas[currentgame.areacount] = newarea;
}

function renumberObject(obj){
	var newobj 	= { };
	var num 	= 0;
	
	for(var key in obj){
		newobj[num] = obj[key];
		num++;
	}
	
	return newobj;
}

JezzBallGame.prototype.debug = function(){
	var areas = { };
	var areacontainer = null;
	var ballcontainer = null;
	var balls = { };
	var ballcnt = 0;
	
	$("#areacontainer").empty();
	$("#ballcontainer").empty();
	
	for(var a=0;a<=currentgame.areacount;a++){
		var area = currentgame.gameareas[a];
		areacontainer = $("<div id='area" + a.toString() + "' class='areadebugbox'>" + 
						"<div class='debuglabel'>Area #: </div>" + 
						"<div class='debugvalue'>" + a.toString() + "</div>" + 
						"<div class='debuglabel'>Area Start X: </div>" + 
						"<div class='debugvalue'>" + area.startX.toString() + "</div>" + 
						"<div class='debuglabel'>Area Start Y: </div>" + 
						"<div class='debugvalue'>" + area.startY.toString() + "</div>" + 
						"<div class='debuglabel'>Area Width: </div>" + 
						"<div class='debugvalue'>" + area.width.toString() + "</div>" + 
						"<div class='debuglabel'>Area Height: </div>" + 
						"<div class='debugvalue'>" + area.height.toString() + "</div>" + 
					"</div>");
		
		areas[a] = areacontainer;
		
		for(var b=0;b<area.ballcount;b++){
			var ball = area.ballsack[b];
			
			ballcontainer = $("<div id='ball" + ballcnt.toString() + "' class='balldebugbox'>" + 
						"<div class='debuglabel'>Ball #: </div>" + 
						"<div class='debugvalue'>" + b.toString() + "</div>" + 
						"<div class='debuglabel'>Ball Bounding X: </div>" + 
						"<div class='debugvalue'>" + ball.boundingbox['x'].toString() + "</div>" + 
						"<div class='debuglabel'>Ball Bounding Y: </div>" + 
						"<div class='debugvalue'>" + ball.boundingbox['y'].toString() + "</div>" + 
						"<div class='debuglabel'>Ball Bounding Width: </div>" + 
						"<div class='debugvalue'>" + ball.boundingbox['w'].toString() + "</div>" + 
						"<div class='debuglabel'>Ball Bounding Height: </div>" + 
						"<div class='debugvalue'>" + ball.boundingbox['h'] + "</div>" + 
					"</div>");
			
			balls[ballcnt] = ballcontainer;
			ballcnt++;
		}	
	}
	
	for(var c=0;c<Object.size(areas);c++){
		$("#areacontainer").append(areas[c]);
	}
	
	for(var d=0;d<Object.size(balls);d++){
		$("#ballcontainer").append(balls[d]);
	}
}

JezzBallGame.prototype.drawBall = function(ball, bcnt){
	currentcontext.beginPath();
		
	if(bcnt == 0 || bcnt == 3 || bcnt == 6 || bcnt == 9){ currentcontext.fillStyle = 'rgb(234,40,3)'; };		
	if(bcnt == 1 || bcnt == 4 || bcnt == 7){ currentcontext.fillStyle = 'rgb(40,40,3)'; };
	if(bcnt == 2 || bcnt == 5 || bcnt == 8){ currentcontext.fillStyle = 'rgb(84,20,3)'; };
	
	currentcontext.arc(
		ball.curX, 
		ball.curY,
		ball.ballsize, 
		0, 
		Math.PI*2, 
		true
	);
	
	currentcontext.closePath();
	currentcontext.fill();
	
	currentcontext.beginPath();			
	currentcontext.rect(ball.boundingbox['x'], ball.boundingbox['y'], ball.boundingbox['w'], ball.boundingbox['h']);
	currentcontext.lineWidth = 1;
	currentcontext.strokeStyle = 'blue';
	currentcontext.stroke();
	currentcontext.closePath();
}

JezzBallGame.prototype.drawBallsLines = function(){	
	for(var c=0;c<currentgame.linecount;c++){		
		var line = currentgame.lines[c]['lineobj'];
		
		if(!line.linedrawn){
			var ballLocScore 	= 0;
			var ballLocMod	 	= 0;
			var ballLocDiv   	= 0;
			
			for(var i=0;i<Object.size(currentgame.currentarea.ballsack);i++){
				var ball = currentgame.currentarea.ballsack[i];		
				ballLocScore += ball.getPositionToLine(line);
				
				if(ballLocScore < 0){
					line.hit = true;
					break;
				}
			}
			
			if(!line.hit){
				ballLocMod = ballLocScore % currentgame.currentarea.ballcount;
				ballLocDiv = Math.floor(ballLocScore / currentgame.currentarea.ballcount);
				
				switch(ballLocMod){
					case 0:
						if(ballLocDiv == 0){
							textside 		= (currentgame.direction == "vertical") ? "LEFT" : "TOP"; // Left of line or above line
						} else if(ballLocDiv == 1){
							textside 		= (currentgame.direction == "vertical") ? "RIGHT" : "BOTTOM";	// right of line or below line
						}
					break;
					
					default:
						if(currentgame.direction == "vertical"){
							textside 		= "BOTH-V";					
						} else {
							textside 		= "BOTH-H";					
						}
					break;	
				}
						
				line.ballside 				= textside;
				
			} else {
				currentgame.lines[currentgame.linecount] 	= null; 
			}
		
		// Draw line in current form
		
			if(line.direction == "vertical"){
				if(!line.bottomdone){
					line.height	+= (line.speed * 2);
					line.height = (line.endY >= currentgame.currentarea.height) ? currentgame.currentarea.height : line.height;
				}
				
				if(!line.topdone){
					line.startY -= line.speed;
					line.startY = (line.startY <= currentgame.currentarea.startY) ? 0 : line.startY;
				}			
				
				//rect(x,y,w,h);										
				line.topdone	= (line.startY == 0);
				line.bottomdone	= (line.height == currentgame.currentarea.height);
				line.linedrawn 	= (line.topdone && line.bottomdone);
			} else {
				line.width		+= line.speed
				line.startX 	-=line.speed;
				
				line.width  	= (line.endX >= currentgame.currentarea.width) ? currentgame.currentarea.width : line.width;
				line.startX 	= (line.startX <= currentgame.currentarea.startX) ? currentgame.currentarea.startX : line.startX;
				
				//rect(x,y,w,h);
				line.leftdone	= (line.startX == currentgame.currentarea.startX);
				line.rightdone	= (line.width == currentgame.currentarea.width);
				line.linedrawn 	= (line.leftdone && line.rightdone);
			}
		} else {					
			if(!line.drawnandfilled){
				if(line.direction == "vertical"){
					if(line.ballside == "LEFT"){
						line.endX	= currentgame.currentarea.startX + currentgame.currentarea.width;	
						line.width  = line.endX - line.startX;	
						currentgame.currentarea.width = currentgame.currentarea.width - line.width;
										
					} else if(line.ballside == "RIGHT"){
						line.endX	= line.startX + line.width;
						line.startX = currentgame.currentarea.startX;
						line.width	= line.endX - line.startX;
						
						currentgame.currentarea.startX += line.width;
						currentgame.currentarea.width  -= line.width;
						
					} else if(line.ballside == "BOTH-V"){
						line.endX   = line.startX + line.width;
						
						// create new area since it's drawn
						currentgame.createNewArea(currentgame.currentarea, line);
						
					}
				} else {
					if(line.ballside == "TOP"){
						line.endY	= currentgame.height;
						currentgame.currentarea.height = line.startY;
						
					} else if(line.ballside == "BOTTOM"){
						line.height	= line.startY + line.height;
						line.startY = currentgame.currentarea.startY;
						line.endY	= line.height;
						currentgame.currentarea.startY = line.endY;
						
					} else if(line.ballside == "BOTH-H"){
						line.endY   = line.startY + line.height;
						
						currentgame.createNewArea(currentgame.currentarea,line);
					}							
				}	
				
				line.drawnandfilled = true;					
			}
		}
		
		currentcontext.beginPath();
		currentcontext.fillStyle = 'rgb(0,0,0)';
		currentcontext.rect(line.startX, line.startY, line.width, line.height);
		currentcontext.fill();
		
		currentcontext.closePath();
	}
		
	if(currentgame.lines == null){
		for(var a=0;a<currentgame.currentarea.ballcount;a++){
			var ball = currentgame.currentarea.ballsack[a];
				
			if((ball.boundingbox['x'] <= currentgame.currentarea.startX) || ((ball.boundingbox['x'] + ball.boundingbox['w']) >= currentgame.currentarea.width )){ 
				ball.speedX = -ball.speedX; 
			}
			
			if((ball.boundingbox['y'] <= currentgame.currentarea.startY) || ((ball.boundingbox['y'] + ball.boundingbox['h']) >= currentgame.currentarea.height )){ 
				ball.speedY = -ball.speedY; 
			}
			
			ball.curX += ball.speedX;
			ball.curY += ball.speedY;
			ball.boundingbox['x'] 	= ball.curX - ball.ballsize;
			ball.boundingbox['y'] 	= ball.curY - ball.ballsize;
			ball.boundingbox['w']	= ball.ballsize * 2;
			ball.boundingbox['h'] 	= ball.ballsize * 2;
			
			currentgame.drawBall(ball, a);
		} 
	} else {
		for(var b=0;b<=currentgame.areacount;b++){
			var area = currentgame.gameareas[b];
			if(area.ballcount > 0){
				for(var c=0;c<area.ballcount;c++){
					var ball = area.ballsack[c];
					
					if((ball.boundingbox['x'] <= area.startX) || ((ball.boundingbox['x'] + ball.boundingbox['w']) >= (area.startX + area.width))){ 
						ball.speedX = -ball.speedX; 
					}
					
					if((ball.boundingbox['y'] <= area.startY) || ((ball.boundingbox['y'] + ball.boundingbox['h']) >= (area.startY + area.height))){ 
						ball.speedY = -ball.speedY; 
					}
					
					ball.curX += ball.speedX;
					ball.curY += ball.speedY;
					
					ball.boundingbox['x'] 	= ball.curX - ball.ballsize;
					ball.boundingbox['y'] 	= ball.curY - ball.ballsize;
					ball.boundingbox['w']	= ball.ballsize * 2;
					ball.boundingbox['h'] 	= ball.ballsize * 2;
					
					currentgame.drawBall(ball, c);
				}
			}	
		}
	}
}

JezzBallGame.prototype.newBall = function(size, id, startX, startY){
	return new JezzBallBall(size, startX, startY, this.ballspeed, id.toString() + "ballobj");
};

JezzBallGame.prototype.newGame = function(){
	this.areacount		= 0;
	this.ballsize		= 10;
	this.ballspeed 		= 2;
	this.currenttime 	= 0;
	this.currentpercent = 0.00;
	this.currentlives   = 3;
	this.currentscore   = 0;
	
	this.ballsack		= { };	
	this.width			= 640;
	this.height			= 480;
	
	var color			= "";
	this.gameareas		= { };

	this.gameareas[this.areacount] 				= new JezzBallGameArea(0,0, this.width, this.height);
	this.gameareas[this.areacount].ballcount 	= 2;
	this.gameareas[this.areacount].ballsack 	= { };
	this.linecount								= 0;
	this.lines									= { };
		
	for(var a=0;a<this.gameareas[this.areacount].ballcount;a++){
		nX = Math.floor(Math.random()*(this.width-this.ballsize));
		nY = Math.floor(Math.random()*(this.height-this.ballsize));
		
		if(nX <= 10){ nX = 10; }		
		if(nY <= 10){ nY = 10; }
		
		if(nX >= this.width - this.ballsize){ nX = this.width - this.ballsize; }
		if(nY >= this.height - this.ballsize){ nY = this.height - (this.ballsize +5); }
				
		this.gameareas[this.areacount].ballsack[a] = this.newBall(this.ballsize, a, nX, nY);
	}	
		
	currentcanvas.addEventListener("mousedown", getCanvasPosition, false);
	setInterval("currentgame.runGame();", 10);
};

JezzBallGame.prototype.runGame = function(){
	currentcontext.clearRect(0,0,this.width,this.height);
	currentcontext.fillStyle = "#FFF";
	currentcontext.fillRect(0,0,this.width,this.height);
	
	var gridopts = {
		distance: 20,
		lineWidth: 1,
		gridColor: "#AAAAAA",
		caption: false
	}; 
	
	new Grid(gridopts).draw(currentcontext);
	if(this.lives > 0){
		currentgame.drawBallsLines();
		currentgame.debug();
	} else {
		// Draw game over screen
	}	
}

function getCanvasPosition(event){
	var rect	= currentcanvas.getBoundingClientRect();
	
	// Mouse X & Y
	var mx 		= event.clientX - rect.left;
	var my 		= event.clientY - rect.top;	
	var line	= null;
	var area 	= null;
	
	currentgame.currentarea = null;
	
	for(var a=0;a<=currentgame.areacount;a++){
		area = currentgame.gameareas[a];
		if((mx >= area.startX && my >= area.startY) && (mx <= (area.startX + area.width) && my <= (area.startY + area.height))){
			currentgame.currentarea = area;
			break;
		}
	}
		
	if(area != null){
		if(currentgame.lines[currentgame.linecount] != null){
			if(currentgame.lines[currentgame.linecount]['lineobj'].drawnandfilled == true){
				currentgame.linecount++;
			}
		}
		
		line = new JezzBallLine(mx, my, 20, 20, area);
		if(currentgame.lines[currentgame.linecount] != null){
			currentgame.lines[currentgame.linecount]['lineobj'] 	= line;
			currentgame.linecount++;
		} else {
			currentgame.lines.splice(currentgame.linecount, 1);
			currentgame.lines = (Object.size(currentgame.lines) == 0 ? null : currentgame.lines);
		}
	}
}