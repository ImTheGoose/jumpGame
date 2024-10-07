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

boxX = [];
boxY = [];
boxWidth = [];
boxHeight = [];
colSize = 30;

//W,A,S,D
pressedKeys = [false,false,false,false];

xpos = [];  // erklærer arrays
ypos = [];

function setup() {
  createCanvas(1200, 1600);
  for (let i = 0; i < 64; i++) {
    xpos.push(0); // giver array med 50 pladser, fra 0 til 49, hvori der er værdien 0 på alle pladser
    ypos.push(0);
  }

  boxGen(100,100,50,100);

  boxGen(450,300,250,30);

  boxGen(0,1550,1200,50)

  boxGen(850,600,200,200)
  boxGen(500,800,150,150)
  boxGen(200,500,200,100)
  boxGen(250,1100,100,250)
  boxGen(700,1300,150,300)
  boxGen(900,1100,50,50)
  boxGen(1000,200,200,25)

}

function draw() {
  background(35);
  fill(100)
  text(boxX.length,50,50,100,100)
  //rect(0,580,800,50,255)


  boxDraw();


  movementCalc();
  move();

  trailRenderer();

}

//calculation and rendering of boxes in project.
function boxGen(x,y,width,height){
  //adds region parameters for calculating collission later
  boxX.push(x)
  boxY.push(y)
  boxWidth.push(width)
  boxHeight.push(height)
}

function boxDraw(){
  for (i = 0; i < boxX.length; i++){
    fill(255);
    rect(boxX[i],boxY[i],boxWidth[i],boxHeight[i])
  }
}

//calculates what to do when hitting a box
function boxHit(){

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

  //Applies gravity and y movement
  ya -= g
  yh = ya

  //boxHit();
  xh = xa

  //collission calculator
  for (i = 0; i < boxX.length; i++){
    if (yposNu-yh > boxY[i]-colSize && yposNu-yh < boxY[i]+boxHeight[i]+colSize && xposNu-xh > boxX[i]-colSize && xposNu-xh < boxX[i]+boxWidth[i]+colSize){
      if (xposNu < boxX[i]-colSize && xposNu-xh > boxX[i]-colSize){
        xh = 0;
        xa = 0;
      }
      if (xposNu > boxX[i]+boxWidth[i]+colSize && xposNu-xh < boxX[i]+boxWidth[i]+colSize){
        xh = 0;
        xa = 0;
      }
      if (yposNu < boxY[i]-colSize && yposNu-yh > boxY[i]-colSize){
        yh = 0;
        ya = 0;
      }
      if (yposNu > boxY[i]+boxHeight[i]+colSize && yposNu-yh < boxY[i]+boxHeight[i]+colSize){
        yh = 0;
        ya = 0;
      }

      //xh += 200;
    }
  }



  yposNu -= yh

  //Makes sure the ball doesnt run through the ground.
  /*
  if (yposNu > 550){
    yh = 0;
    ya = 0;
    yposNu = 550;
  }

   */

  //applies x movement

  xposNu -= xh
}

//calculates and applies acceleration based on active keys
function movementCalc(){
  if (pressedKeys[0]){
    ya += jumpSpeed;
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
}
