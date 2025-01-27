/*
 * made using ml5
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 */

let handPose;
let video;
let hands = [];
let resize = 5
let frame0;
let frame1;
let frame2;
let title;
let backButton;
let music;

let radius = 60;
let pixelInfo = [] //contains information about each pixel
let changedPixels = []
let d
let p = 0
let frameThres = 30
let frameThres2 = 20
let mX
let mY

let maxTime = 100
let gameState = 'title'
let gameMode

let mButton
let vButton

let changeRadius = 3
let button



function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
  //import images
  frame0 = loadImage('images/pixil-frame-0.png');
  frame1 = loadImage('images/pixil-frame-1.png');
  frame2 = loadImage('images/pixil-frame-2.png');
  backButton = loadImage('images/backButton.png');
  title = loadImage('images/title.png');
}

function setup() {
  let canvas = createCanvas(400,600);
  
  pixelDensity(1)
  d = pixelDensity();
  
  button = createButton('Toggle Fullscreen');
  button.position((windowWidth-150) / 2, (windowHeight + height) / 2 + 20); 

  button.mousePressed(toggleFullscreen); // Attach the click handler
  button.style("font-family", "Courier New");
  button.style("background-color", "#ECECEC");
  button.style("border-width", "2px");
  button.style("border-color", "#D1D1D1")


  
  
  //allow you to access the pixil data through frame0.pixels
  frame0.loadPixels();
  frame1.loadPixels();
  frame2.loadPixels();
  //image(frame0,0,0, frame0.width, frame0.height)
  
  //init pixel information
  for (let i = 0; i < width; i++) {
    pixelInfo[i] = []; // Create a new row
    for (let j = 0; j < height; j++) {
      pixelInfo[i][j] = { x: i, y: j, time: 0 }; // Assign pixel info
    }
  }

  
}

function draw() {
  if (gameState == 'title') {
    drawTitleScreen(); // Display the title screen
  }
  else {
    drawGame()
  }


}

function drawGame() {
    //render the base frame
  pixelDensity(1)
  image(frame0, 0, 0, frame1.width, frame1.height)
  loadPixels()
  frame0.loadPixels();
  frame1.loadPixels();
  frame2.loadPixels();

  
  //check the mouse position 
  
  //if the pixel is within the radius of the mouse position
  //increase the time
  //if the time is above a certain number, change the frame
  let iter = 1
  if (gameMode == "video") {
    iter = hands.length
  }
  for (let h = 0; h < iter; h ++) {
  
    if (gameMode == "video") {
      mX = width - int(hands[h].middle_finger_mcp.x)
      mY = int(hands[h].middle_finger_mcp.y)
    }
    if (gameMode == "mouse") {
      mX = mouseX
      mY = mouseY
    }

    startX = int(max(mX - radius, 0))
    endX = min(width, mX + radius)
    startY = max(mY - radius, 0)
    endY = min(height, mY + radius)


    //iterate through the pixels in the radius
    for (x = startX; x < endX; x++) {
      for (y = startY; y < endY; y++) {
        //(x - h)^2 + (y - k)^2 < r^2 -> see pixel is inside the radius
        left = (x - mX) * (x - mX) + (y - mY) * (y - mY)
        if (left < radius * radius) { //inside the radius
          //increase the time for the pixel
          if (x >= 0 && x < width && y >= 0 && y < height) {
            //console.log(x,y)
            //console.log(pixelInfo)
            let p = pixelInfo[x][y];

            if (p) { // Ensure p is valid
              if (p.time == 0) {
                changedPixels.push(p);
              }
              if (p.time < frameThres) {
                p.time = max(p.time + (1 - (left / radius / radius)), 0.75);
                p.time = min(p.time, maxTime)
              } else if (p.time >= frameThres) {
                p.time = max(p.time + (1 - (left / radius / radius)), 0.8);
                p.time = min(p.time, maxTime)
              }
            }
          }
        }
      }
    }
  }
  let pixelsToPush = []
  
  //go through changedPixels
  for (i = changedPixels.length-1; i >= 0; i--) {
    p = changedPixels[i]
    if (p.time < frameThres) { //differenciate between frame0 and frame1

      let index = 4 * (p.y * frame1.width + p.x);
      let ratio = p.time / frameThres

      let newR = (frame1.pixels[index] * ratio) + (pixels[index] * (1 - ratio))
      let newG = (frame1.pixels[index + 1] * ratio) + (pixels[index + 1] * (1 - ratio))
      let newB = (frame1.pixels[index + 2] * ratio) + (pixels[index + 2] * (1 - ratio))

      pixels[index] = newR
      pixels[index + 1] = newG
      pixels[index + 2] = newB

    }
    if (p.time >= frameThres) {
      let index = 4 * (p.y * frame2.width + p.x);
      let ratio = min((p.time - frameThres) / frameThres2, 1)

      let newR = (frame2.pixels[index] * ratio) + (frame1.pixels[index] * (1 - ratio))
      let newG = (frame2.pixels[index + 1] * ratio) + (frame1.pixels[index + 1] * (1 - ratio))
      let newB = (frame2.pixels[index + 2] * ratio) + (frame1.pixels[index + 2] * (1 - ratio))

      pixels[index] = newR
      pixels[index + 1] = newG
      pixels[index + 2] = newB
    }
    //if the pixel is not within the radius
    //decrease the time
    
    left = (p.x - mX) * (p.x - mX) + (p.y - mY) * (p.y - mY)
    //console.log(left)
    if (left > radius * radius) { //not in the radius
      p.time = max(p.time - 0.1,0)
      if (p.time == 0) {
        changedPixels.splice(i,1)
      }
    }
  }
  
  
  updatePixels()
  
  image(backButton, 10, 560)
  checkBackButton()
}

function mouseMode() {
}

function drawTitleScreen() {
  image(title,0,0)
  mX = mouseX 
  mY = mouseY
  ///mButton.size(167-96, 336-307);
  let checkX = mX > 96 && mX < 167
  let checkY = mY > 307 && mY < 336
  if (checkX && checkY && mouseIsPressed ) {
    gameMode = "mouse"
    gameState = "play"
  }
  //223,307 && 311,336
  checkX = mX > 223 && mX < 311
  checkY = mY > 311 && mY < 336
  if (checkX && checkY && mouseIsPressed ) {
    gameMode = "video"
    gameState = "play"
    // Create the webcam video and hide it
    video = createCapture(VIDEO);
    video.size(400, 600);
    video.hide();
    // start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);
    radius = 75
    frameThres = 20

  
  }
  
}

function checkBackButton() {
  mX = mouseX 
  mY = mouseY
  ///mButton.size(167-96, 336-307);
  let checkX = mX > 10 && mX < 80
  let checkY = mY > 560 && mY < 590
  if (checkX && checkY && mouseIsPressed) { 
    //if back button is pressed, reset everything
    gameState = 'title'
    gameMode = ''
    setup()
    changedPixels = []
    
  }
}

function mouseDragged() {
  if (gameMode == "mouse") {
    if (movedX > 0) {
      radius += changeRadius
    }
    if (movedX < 0) {
      radius -= changeRadius
    }
  }
}

function toggleFullscreen() {
  let fs = fullscreen(); // Check if fullscreen is active
  fullscreen(!fs); // Toggle fullscreen mode
}

function windowResized() {
  resizeCanvas(400, 600);
  button.position((windowWidth - 150) / 2, (windowHeight + height) / 2 + 20); // Re-center the button
  button.style("background-color", "#A3A3A3");
  button.style("border-width", "2px");
  button.style("border-color", "#747474")
}


function getPixel(x,y) {
  return y * width + x;
  
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}