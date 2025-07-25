//Debug settings
const debugHUD = false; //Enables or disables debug hub
const debug1 = false; //Visualise spots in ranPos
const debug2 = false; //Visualise hitboxes

//Debug variables
let colCheck = [false, false, false, false, false];

//Stats
let highscore = 0;
let score = 0;

//Movement related
const g = 0.3;
const f = 0.3;
const speed = 1;
const maxSpeed = 10;
const maxSpeedN = -10;
const maxSpeedY = 8;
const jumpSpeed = 1.5;

//Active movement trackers
let yh = 0
let ya = 0
let xa = 0
let xh = 0;
let xposNu = 100;
let yposNu = 100;
//Active keys [W,A,S,D]
let pressedKeys = [false,false,false,false];

//Collision data
let boxX = [];
let boxY = [];
let boxWidth = [];
let boxHeight = [];
//0 = none | 1 = deathbox | 2 = nonlethal | 3 = startplatform | 4 = point
let boxType = [];
let boxColSize = [];
const colSizeDB = 15;
const colSizePoint = 35;
const colSizeNonLethal = 30;
const colSizeDefault = 0;

//Other stuff
const windowSize = [3840,2160]
const spawnXY = [windowSize[0]/2,windowSize[1]-150]
let gameStarted = false;
let xpos = [];  // For trails
let ypos = []; // For trails
let isFullscreen = false

//point settings
const pointDistance = 80;
const pointAtOnce = 5;



function setup() {
  createCanvas(windowWidth, windowHeight);

  //Trail primer
  for (let i = 0; i < 64; i++) {
    xpos.push(spawnXY[0]); // giver array med 50 pladser, fra 0 til 49, hvori der er værdien 0 på alle pladser
    ypos.push(spawnXY[1]);
  }
  xposNu = spawnXY[0];
  yposNu = spawnXY[1];

  //Data lodaing
  highscore = localStorage.getItem("hs")
  if (highscore === null){
    highscore = 0;
    localStorage.setItem("hs",0)
  }

  frameRate(63);
  genMap();

  //Initial point generation
  for (let i = 0; i < pointAtOnce; i++){
    p = ranPos();
    boxGen(p[0],p[1],75,75, 4)
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
}

function draw() {
  background(35);
  fill(100)
  scale(windowWidth/windowSize[0])

  //Bugfix for ghosting through wall. DONT REMOVE. Phasing happens when float is an integer.
  xposNu += 0.0000000000001;
  yposNu += 0.0000000000001;

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

function genMap(){
  boxGen(0,windowSize[1]-50,windowSize[0],50,2)
  boxGen(0,0,50,windowSize[1],2)
  boxGen(0,0,windowSize[0],50,2)
  boxGen(windowSize[0]-50,0,50,windowSize[1],2)
  boxGen(windowSize[0]/2-100,windowSize[1]-100,200,100,3)
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
}

function ranPos(debug){
  //Creates a random X and Y position that doesn't touch a box
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

  //Assigns collision size as type dependant
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
  //Draws a box in a style according to its type.
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



function checkStart(){
  //Checks if player is out of start region
  if (xposNu < windowSize[0]/2-150 || xposNu > windowSize[0]/2+150 || yposNu < windowSize[1]-350){
    gameStarted = true;
  }
}


function move(){
  //Moves the player based on pre calculated factors
  //applies friction and limits velocity
  if (xa < 0){
    xa += f
    //Fixes bug mentioned bellow
    if (xa > 0){
      xa = 0;
    }
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
    }
  }
  //applies x and y movement to position
  yposNu -= yh
  xposNu -= xh
}

function death(){
  //Resets all variables to default and saves data
  xposNu = spawnXY[0];
  yposNu = spawnXY[1];
  gameStarted = false;

  //Repositions points on screen.
  for (let i = 0; i < boxX.length; i++){
    if (boxType[i] === 4){
      let p = ranPos();
      boxX[i] = p[0];
      boxY[i] = p[1];
    }
  }

  localStorage.setItem("hs",highscore)
  score = 0;
}

function pointHit(index){
  //Function for handeling a point interaction
  let p = ranPos();
  boxX[index] = p[0];
  boxY[index] = p[1];
  score += 1;
  if (highscore < score){
    highscore = score;
  }
}

function movementCalc(){
  //calculates and applies acceleration based on active keys
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

function keyPressed(){
  //Register a key as pressed.
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

function keyReleased(){
  //Registers that a key has been let go
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

  if (key === 'f'){
    isFullscreen = !isFullscreen
    fullscreen(isFullscreen)
  }

}


function trailRenderer(){
  //Ball and trail renderer.
  //Shift positions and adds current position
  for (let i = 0; i < xpos.length - 1; i++) {
    xpos[i] = xpos[i + 1];
    ypos[i] = ypos[i + 1];
  }
  xpos[xpos.length - 1] = xposNu;
  ypos[ypos.length - 1] = yposNu;

  //draws ball and trail
  for (let i = 0; i < xpos.length; i++) {
    noStroke();
    fill(0+i*4, 0, 0+i*4,0+i*4);
    ellipse(xpos[i], ypos[i], i, i);

  }

  //Hitbox of player for debuggin
  if (debug2){
    fill(255,255,255,0)
    stroke(255)
    strokeWeight(2)
    rect(xposNu-30,yposNu-30,60,60)
    strokeWeight(0)
  }
}
