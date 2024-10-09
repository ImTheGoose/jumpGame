debugHUD = false; //Enables or disables debug hub
debug1 = false; //Visualise spots in ranPos
debug2 = false; //Visualise hitboxes


highscore = 0;
score = 0;


g = 0.3;
f = 0.3;
speed = 1;
maxSpeed = 10;
maxSpeedN = -10;
maxSpeedY = 8;
jumpSpeed = 1.5;
yh = 0
ya = 0
xa = 0
xh = 0
xposNu = 100;
yposNu = 100;

colCheck = [false, false, false, false, false];

boxX = [];
boxY = [];
boxWidth = [];
boxHeight = [];
//0 = none | 1 = deathbox | 2 = nonlethal | 3 = startplatform | 4 = point
boxType = [];
boxColSize = [];
colSizeDB = 15;
colSizePoint = 35;
colSizeNonLethal = 30;
colSizeDefault = 0;

const windowSize = [3200,1600]

spawnXY = [windowSize[0]/2,windowSize[1]-150]



pointDistance = 80;
pointAtOnce = 5;

gameStarted = false;

//W,A,S,D
pressedKeys = [false,false,false,false];

xpos = [];  // erklærer arrays
ypos = [];

let test;

function setup() {
  createCanvas(windowSize[0], windowSize[1]);
  for (let i = 0; i < 64; i++) {
    xpos.push(spawnXY[0]); // giver array med 50 pladser, fra 0 til 49, hvori der er værdien 0 på alle pladser
    ypos.push(spawnXY[1]);
  }
  xposNu = spawnXY[0];
  yposNu = spawnXY[1];
  frameRate(63)

  boxGen(0,1550,3200,50,2)
  boxGen(0,0,50,1600,2)
  boxGen(0,0,3200,50,2)
  boxGen(3150,0,50,1600,2)

  boxGen(1500,1500,200,100,3)

  boxGen(100,100,50,100, 1);
  boxGen(450,300,250,30, 1);
  boxGen(850,600,200,200,1)
  boxGen(500,800,150,150, 1)
  boxGen(200,500,200,100, 1)
  boxGen(250,1100,100,250, 1)
  boxGen(700,1300,150,300, 1)
  boxGen(900,1100,50,50, 1)
  boxGen(1000,200,200,25, 1)
  boxGen(2000,300,50,250, 1)
  boxGen(1850,750,100,100, 1)
  boxGen(2500,200,50,300, 1)


  boxGen(2200,1300,500,25, 1)
  boxGen(2200,1050,250,25, 1)
  boxGen(2650,1050,50,25, 1)

  boxGen(2300,200,200,50, 1)
  boxGen(2250,450,50,50, 1)
  boxGen(2500,200,50,300, 1)

  boxGen(1500,300,150,150, 1)
  boxGen(1300,600,50,50, 1)
  boxGen(1600,900,100,100, 1)
  boxGen(1200,1200,150,150, 1)

  boxGen(2800,400,100,300, 1)
  boxGen(2900,900,100,100, 1)



  for (let i = 0; i < pointAtOnce; i++){
    p = ranPos();
    boxGen(p[0],p[1],75,75, 4)
  }



}

function draw() {
  background(35);
  fill(100)

  //Bugfix for ghosting through wall. DONT REMOVE. Phasing happens when float is an integer.
  xposNu += 0.0000000000001;
  yposNu += 0.0000000000001;




  //rect(0,580,800,50,255)

  if (debug1){
    ranPos(debug1)
    frameRate(200);
  }


  newBoxDraw();

  movementCalc();
  move();

  trailRenderer();

  if (!gameStarted){
    checkStart();
  }
  drawHUD();

}

function drawHUD(){
  textSize(80)
  fill(230)
  textStyle(BOLD)
  textAlign(CENTER)
  text('Score: '+score,windowSize[0]/2,125)
  textSize(30)
  text('Highscore: '+highscore,windowSize[0]/2,160)


  if (debugHUD){
    textAlign(LEFT)
    text("ya: "+ya,50,50)
    text("xa: "+xa,50,100)
    text("xPosNu: "+xposNu,50,150)
    text("yPosNu: "+yposNu,50,200)
    text("Collision: "+colCheck[0],50,250)
    text("Collision +x: "+colCheck[1],50,300)
    text("Collision -x: "+colCheck[2],50,350)
    text("Collision +y: "+colCheck[3],50,400)
    text("Collision -y: "+colCheck[4],50,450)

  }
}


function ranPos(debug){
  let x = 0;
  let y = 0;
  for (let ii = 0; ii < 20; ii++){
    x = Math.floor(Math.random() * (windowSize[0] - 0) + 0)
    y = Math.floor(Math.random() * (windowSize[1] - 0) + 0)
    useable = false;
    for (i = 0; i < boxX.length; i++){
      if (y+pointDistance > boxY[i] && y < boxY[i]+boxHeight[i] && x+pointDistance > boxX[i] && x < boxX[i]+boxWidth[i] && boxType[i] !== 4){
        useable = false;
        break;
      }else{
        useable = true;
      }
    }
    if (useable){
      break;
    }
  }

  if (debug){
    boxGen(x,y,75,75,4)
  }
  return [x,y]
}

//calculation and rendering of boxes in project.
function boxGen(x,y,width,height,type){
  //adds region parameters for calculating collission later
  boxX.push(x)
  boxY.push(y)
  boxWidth.push(width)
  boxHeight.push(height)
  boxType.push(type)
  
  if (type === 1){
    boxColSize.push(colSizeDB)
  }else if (type === 2 || type === 3){
    boxColSize.push(colSizeNonLethal)
  }else if (type === 4){
    boxColSize.push(colSizePoint)
  }else{
    boxColSize.push(colSizeDefault)
  }
}

function newBoxDraw(){
  ellipseMode(CORNER)
  for (i = 0; i < boxX.length; i++){
    if (boxType[i] === 1){
      fill(color(45,90,255))
      rect(boxX[i],boxY[i],boxWidth[i],boxHeight[i])
    }
    if (boxType[i] === 2){
      fill(color(70))
      rect(boxX[i],boxY[i],boxWidth[i],boxHeight[i])
    }
    if (boxType[i] === 3){
      if (!gameStarted){
        fill(color(0,150,0))

      }else{
        fill(color(45,90,255))
      }
      rect(boxX[i],boxY[i],boxWidth[i],boxHeight[i])
    }
    if (boxType[i] === 4){
      fill (0,255,0,130)

      ellipse(boxX[i],boxY[i],boxWidth[i],boxHeight[i])
      if (debug2){
        fill(255,255,255,0)
        stroke(255)
        strokeWeight(2)
        rect(boxX[i],boxY[i],boxWidth[i],boxHeight[i])
        strokeWeight(0)
      }
    }
  }
  ellipseMode(CENTER)
}


//Checks if player is out of start region
function checkStart(){
  if (xposNu < 1450 || xposNu > 1750 || ypos > 1450){
    gameStarted = true;
  }
}

//Moves the player based on pre calculated factors
function move(){
  //applies friction and limits velocity
  if (xa < 0){
    xa += f
    //Fixes bug mentioned bellow
    if (xa > 0){
      xa = 0;
    }
    //Make sure that ball doesnt exceed max speed in negative direction.
    if (xa < maxSpeedN){
      xa = maxSpeedN;
    }
  }
  //applies friction and limits velocity.
  if (xa > 0){
    xa -= f
    //fixes a bug where accelleration wouldn't hit zero.
    if (xa < 0){
      xa = 0;
    }
    //Makes sure that ball doesnt exceed max speed
    if (xa > maxSpeed){
      xa = maxSpeed;
    }
  }

  if (ya > maxSpeedY){
    ya = maxSpeedY;
  }

  //Applies gravity and applies accelleration
  ya -= g
  yh = ya
  xh = xa

  //collission calculator
  colCheck[0] = false;


  for (i = 0; i < boxX.length; i++){
    if (yposNu-yh > boxY[i]-boxColSize[i] && yposNu-yh < boxY[i]+boxHeight[i]+boxColSize[i] && xposNu-xh > boxX[i]-boxColSize[i] && xposNu-xh < boxX[i]+boxWidth[i]+boxColSize[i]){
      colCheck[0] = true;
      if (xposNu < boxX[i]-boxColSize[i] && xposNu-xh > boxX[i]-boxColSize[i]){
        colCheck[1] = true;
        if (boxType[i] === 1 || boxType[i] === 3 && gameStarted){
          death();
        }
        if (boxType[i] === 4){
          pointHit(i)
        }else{
          xh = 0;
          xa = 0;
        }
      }
      if (xposNu > boxX[i]+boxWidth[i]+boxColSize[i] && xposNu-xh < boxX[i]+boxWidth[i]+boxColSize[i]){
        colCheck[2] = true;
        if (boxType[i] === 1 || boxType[i] === 3 && gameStarted){
          death();
        }
        if (boxType[i] === 4){
          pointHit(i)
        }else{
          xh = 0;
          xa = 0;
        }
      }
      if (yposNu < boxY[i]-boxColSize[i] && yposNu-yh > boxY[i]-boxColSize[i]){
        colCheck[3] = true;
        if (boxType[i] === 1 || boxType[i] === 3 && gameStarted){
          death();
        }
        if (boxType[i] === 4){
          pointHit(i)
        }else{
          yh = 0;
          ya = 0;
        }
      }
      if (yposNu > boxY[i]+boxHeight[i]+boxColSize[i] && yposNu-yh < boxY[i]+boxHeight[i]+boxColSize[i]){
        colCheck[4] = true;
        if (boxType[i] === 1 || boxType[i] === 3 && gameStarted){
          death();
        }
        if (boxType[i] === 4){
          pointHit(i)
        }else{
          yh = 0;
          ya = 0;
        }
      }

      //xh += 200;
    }
  }


  //applies x and y movement
  yposNu -= yh
  xposNu -= xh
}

function death(){
  xposNu = spawnXY[0];
  yposNu = spawnXY[1];
  gameStarted = false;

  for (let i = 0; i < boxX.length; i++){
    if (boxType[i] === 4){
      let p = ranPos();
      boxX[i] = p[0];
      boxY[i] = p[1];
    }
  }

  score = 0;
  /*
  boxX.length = 0;
  boxY.length = 0;
  boxWidth.length = 0;
  boxHeight.length = 0;
  boxType.length = 0;
  xpos.length = 0;
  ypos.length = 0;
  setup();

   */

}

function pointHit(index){
  let p = ranPos();
  boxX[index] = p[0];
  boxY[index] = p[1];
  score += 1;
  if (highscore < score){
    highscore = score;
  }
}


//calculates and applies acceleration based on active keys
function movementCalc(){
  if (pressedKeys[0]){
    ya += jumpSpeed-(ya/maxSpeedY);
  }
  if (pressedKeys[1]){
    xa += speed;
  }
  if (pressedKeys[2]){

  }
  if (pressedKeys[3]){
    xa -= speed;
  }
}

//Register a key as pressed.
function keyPressed(){
  if (key === 'w'){
    pressedKeys[0] = true;
  }
  if (key === 'a'){
    pressedKeys[1] = true;
  }
  if (key === 's'){
    pressedKeys[2] = true;
  }
  if (key === 'd'){
    pressedKeys[3] = true;
  }
}

//Registers that a key has been let go
function keyReleased(){
  if (key === 'w'){
    pressedKeys[0] = false;
  }
  if (key === 'a'){
    pressedKeys[1] = false;
  }
  if (key === 's'){
    pressedKeys[2] = false;
  }
  if (key === 'd'){
    pressedKeys[3] = false;
  }
}

//Ball and trail renderer.
function trailRenderer(){
  for (let i = 0; i < xpos.length - 1; i++) {
    xpos[i] = xpos[i + 1];  // flytte værdierne rundt - altså værdien på plads 48 sættes ind i plads 47
    ypos[i] = ypos[i + 1];
  }
  xpos[xpos.length - 1] = xposNu; // sætter aktuel position i slutningen af arrayet
  ypos[ypos.length - 1] = yposNu;

// tegner tingene - løber array'en igennem og bruger også i til at sætte farve samt størrelse
  for (let i = 0; i < xpos.length; i++) {
    noStroke();
    fill(0+i*4, 0, 0+i*4,0+i*4);
    ellipse(xpos[i], ypos[i], i, i);

  }

  if (debug2){
    fill(255,255,255,0)
    stroke(255)
    strokeWeight(2)
    rect(xposNu-30,yposNu-30,60,60)
    strokeWeight(0)
  }
}
