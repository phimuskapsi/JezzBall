		var curloc	 = ""; // 0 = nothing, 1 = left, 2 = right
	var textside = "";

	for(var a=0;a<Object.size(currentgame.ballsack);a++){
		var ball = currentgame.ballsack[a];
		
		if(currentgame.direction == "vertical"){
			if(ball.curX > this.startX){
				curloc 	+= "R";
			} else if(ball.curX <= this.startX){
				curloc 	+= "L";
			}			
		} else {
			if(ball.curY > this.startY){
				curloc 	+= "T"
			} else if(ball.curY <= this.startY){
				curloc 	+= "B"
			}
		}	
	}
	
	var diffcnt = 0;
	var samecnt = 0;
	var test 	= curloc.charAt(0);
	
	for(var b=0;b<curloc.length;b++){
		if(test == curloc.charAt(b) && b != 0){
			samecnt++;
		} else {
			diffcnt++;
		}
	}

	if(currentgame.direction == "vertical"){
		if(diffcnt > 0){
			textside = "BOTH-V";
		}
	} else {
		if(diffcnt > 0){
			textside = "BOTH-H";
		}
	}
	
	switch(curloc.charAt(0)){
		case "B":
		
		break;
		
		case "L":
		
		break;
		
		case "R":
		
		break;
		
		case "T":
		
		break;	
	}
			
	
	
	if(coveredarea == null){
			if(ball.curX <= ball.ballsize || ball.curX >= (this.width - ball.ballsize)){ 
				ball.speedX = -ball.speedX; 
			}
			if(ball.curY <= ball.ballsize || ball.curY >= (this.height - ball.ballsize)){ 
				ball.speedY = -ball.speedY; 
			}
		} else {
			var unusedheight = 0;
			var unusedwidth = 0;
			
			if(ball.curX <= ball.ballsize || ball.curX >= (this.width - ball.ballsize) || ball.curX <= (this.coveredleftwidth + ball.ballsize) || (ball.curX >= (this.width - this.coveredrightwidth + ball.ballsize))){ 
				ball.speedX = -ball.speedX; 
			}
			
			if(ball.curY <= ball.ballsize || ball.curY >= (this.height - ball.ballsize) || ball.curY >= (this.height - this.coveredbottomheight + ball.ballsize) || ball.curY <= (this.coveredtopheight + ball.ballsize)){ 
				ball.speedY = -ball.speedY; 
			}
		}
		
		ball.curX += ball.speedX;
		ball.curY += ball.speedY;

		currentcontext.beginPath();
		
		if(b == 0 || b == 3 || b == 6 || b == 9){ currentcontext.fillStyle = 'rgb(234,40,3)'; };		
		if(b == 1 || b == 4 || b == 7){ currentcontext.fillStyle = 'rgb(40,40,3)'; };
		if(b == 2 || b == 5 || b == 8){ currentcontext.fillStyle = 'rgb(84,20,3)'; };
		
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
	}

if(coveredarea != null){		
		for(var c=0;c<Object.size(coveredarea);c++){
			currentcontext.beginPath();
			
			if(coveredarea[c]['linedrawn'] == false){
				if(coveredarea[c]['direction'] == "vertical"){
					if(coveredarea[c]['lineobj'].curY > 0){
						coveredarea[c]['lineobj'].curY -= 2;
						if(coveredarea[c]['lineobj'].curY < 0){
							coveredarea[c]['lineobj'].curY = 0;
						}
					}
					
					if(coveredarea[c]['lineobj'].curheight < 480){
						coveredarea[c]['lineobj'].curheight += 4;
						if(coveredarea[c]['lineobj'].curheight > 480){
							coveredarea[c]['lineobj'].curheight = 480;
						}
					}
					
					if(coveredarea[c]['lineobj'].curY == 0 && coveredarea[c]['lineobj'].curheight == 480){
						coveredarea[c]['linedrawn'] = true;
					}
				} else {
					if(coveredarea[c]['lineobj'].curX > 0){
						coveredarea[c]['lineobj'].curX -= 2;
						if(coveredarea[c]['lineobj'].curX < 0){
							coveredarea[c]['lineobj'].curX = 0;
						}
					}				
					
					if(coveredarea[c]['lineobj'].curwidth < 640){
						coveredarea[c]['lineobj'].curwidth += 4;
						if(coveredarea[c]['lineobj'].curwidth > 640){
							coveredarea[c]['lineobj'].curwidth = 640;
						}
					}
					
					if(coveredarea[c]['lineobj'].curX == 0 && coveredarea[c]['lineobj'].curwidth == 640){
						coveredarea[c]['linedrawn'] = true;
					}
				}
				
				currentcontext.rect(coveredarea[c]['lineobj'].curX, coveredarea[c]['lineobj'].curY, coveredarea[c]['lineobj'].curwidth, coveredarea[c]['lineobj'].curheight);
			} else {
				if(coveredarea[c]['direction'] == "vertical"){
					if(coveredarea[c]['finished'] == false){						
						switch(coveredarea[c]['ballside']){
							case "right":					
								currentcontext.rect(this.coveredleftwidth, coveredarea[c]['lineobj'].curY, coveredarea[c]['lineobj'].curX + coveredarea[c]['lineobj'].width, coveredarea[c]['lineobj'].curheight);
								this.coveredleftwidth += (coveredarea[c]['lineobj'].curX + coveredarea[c]['lineobj'].width);								
								coveredarea[c]['finished'] = true;
							break;
							
							case "left":
								currentcontext.rect(coveredarea[c]['lineobj'].curX, coveredarea[c]['lineobj'].curY, (currentgame.width - coveredarea[c]['lineobj'].curX + coveredarea[c]['lineobj'].width), coveredarea[c]['lineobj'].curheight);
								this.coveredrightwidth += (currentgame.width - coveredarea[c]['lineobj'].curX + coveredarea[c]['lineobj'].width);
								coveredarea[c]['finished'] = true;
							break;
							
							case "both":
								currentcontext.rect(coveredarea[c]['lineobj'].curX, coveredarea[c]['lineobj'].curY, coveredarea[c]['lineobj'].curwidth, coveredarea[c]['lineobj'].curheight);
								coveredarea[c]['finished'] = true;
							break;
						}
						
					} else {
						switch(coveredarea[c]['ballside']){
							case "right":
								currentcontext.rect(0, coveredarea[c]['lineobj'].curY, coveredarea[c]['lineobj'].curX + coveredarea[c]['lineobj'].width, coveredarea[c]['lineobj'].curheight);
							break;
							
							case "left":
								currentcontext.rect(coveredarea[c]['lineobj'].curX, coveredarea[c]['lineobj'].curY, (currentgame.width - coveredarea[c]['lineobj'].curX + coveredarea[c]['lineobj'].width) , coveredarea[c]['lineobj'].curheight);
							break;
							
							case "both":
								currentcontext.rect(coveredarea[c]['lineobj'].curX, coveredarea[c]['lineobj'].curY, coveredarea[c]['lineobj'].curwidth, coveredarea[c]['lineobj'].curheight);
							break;
						}
					}
					
					
				} else {
					if(coveredarea[c]['finished'] == false){
						coveredarea[c]['lineobj'].curheight += (coveredarea[c]['lineobj'].curY - coveredheight);
						coveredarea[c]['finished'] = true;
					}
					
					if(currentgame.linecount > 0){
						currentcontext.rect(coveredarea[c]['lineobj'].curX, coveredheight, coveredarea[c]['lineobj'].curwidth, coveredarea[c]['lineobj'].curheight);
					} else {
						currentcontext.rect(coveredarea[c]['lineobj'].curX, 0, coveredarea[c]['lineobj'].curwidth, coveredarea[c]['lineobj'].curheight);
					}
				}
			}
			
			currentcontext.fillStyle = "black";				
			currentcontext.closePath();
			currentcontext.fill();
		}
		





















var hitpoints			= { };
				hitpoints[0]			= { };
				hitpoints[0]['point']   = ((ball.boundingbox['w'] / 2) - 1) * 4;// Top middle point
				
				hitpoints[1]			= { };
				hitpoints[1]['point']   = (((ball.boundingbox['w']) * (Math.floor(ball.boundingbox['h'] / 2) + 1)) - 1) * 4;// right middle point
				
				hitpoints[2]			= { };
				hitpoints[2]['point']   = (((ball.boundingbox['w'] * ball.boundingbox['h']) * 4) - 1) - (Math.ceil(ball.boundingbox['w'] / 2) * 4); // bottom middle point
				
				hitpoints[3]			= { };
				hitpoints[3]['point']   = ((ball.boundingbox['w'] * Math.floor(ball.boundingbox['h'] / 2)) * 4); // left middle point
	
				var ballimg = currentcontext.getImageData(ball.boundingbox['x'],  ball.boundingbox['y'], ball.boundingbox['w'], ball.boundingbox['h']);
				var imgdata = ballimg.data;
				
				for(var i=0;i<4;i++){
					if(imgdata[hitpoints[i]['point']] == 0 && imgdata[hitpoints[i]['point']+1] == 0 && imgdata[hitpoints[i]['point']+2] == 0){
						switch(i){
							case 0:
							case 2:						
								ball.speedY = -ball.speedY;
							break;
							
							case 1:
							case 3:
								ball.speedX = -ball.speedX; 
							break;		
						}
						
						break;
					}
				}