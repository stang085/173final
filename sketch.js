/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

let handPose;
let video;
let hands = [];
let resize = 5
let frame0;
let frame1;
let frame2;
let radius = 60;
let pixelInfo = [] //contains information about each pixel
let changedPixels = []
let d
let p = 0
let frameThres = 30
let frameThres2 = 20


function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
  //import images
  frame0 = loadImage('images/pixil-frame-0.png');
  frame1 = loadImage('images/pixil-frame-1.png');
  frame2 = loadImage('images/pixil-frame-2.png');
}

function setup() {
  createCanvas(400,600);
  pixelDensity(1)
  d = pixelDensity();
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(400, 600);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  
  //import images
  frame0 = loadImage('images/pixil-frame-0.png');
  frame1 = loadImage('images/pixil-frame-1.png');
  frame2 = loadImage('images/pixil-frame-2.png');
  
  
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
  //console.log(frame1.pixels)

  
}

function draw() {
  // Draw the webcam video
  //image(video, 0, 0, width, height);
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
  
  
  for (let h = 0; h < hands.length; h ++) {
  
    let mX = width - int(hands[h].wrist.x)
    let mY = int(hands[h].wrist.y)

    startX = max(mX - radius, 0)
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
            let p = pixelInfo[x][y];

            if (p) { // Ensure p is valid
              if (p.time == 0) {
                changedPixels.push(p);
              }
              if (p.time < frameThres) {
                p.time = max(p.time + (1 - (left / radius / radius)), 0.75);
              } else if (p.time >= frameThres) {
                p.time = max(p.time + (1 - (left / radius / radius)), 0.8);
              }
            }
          }
        }
      }
    }
  }
  
  
  //go through changedPixels
  for (i = 0; i < changedPixels.length; i ++) {
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
    for (let h = 0; h < hands.length; h ++) {
  
      let mX = width - int(hands[h].wrist.x)
      let mY = int(hands[h].wrist.y)
      left = (p.x - mX) * (p.x - mX) + (p.y - mY) * (p.y - mY)
      //console.log(left)
      if (left > radius * radius) { //not in the radius
        p.time = max(p.time - 0.1,0)
        if (p.time == 0) {
          changedPixels.splice(i,1)
        }
      }
    }
  }
  
  
  //if p.time is above a certain threshold then change the frame
  //to calculate the color of the pixel, use the ratio of the two frames
  
  //console.log(changedPixels.length)
  
  
  

  //Draw all the tracked hand points
  // for (let i = 0; i < hands.length; i++) {
  //   let hand = hands[i];
  //   console.log(hands[i])
  //   for (let j = 0; j < hand.keypoints.length; j++) {
  //     let keypoint = hand.keypoints[j];
  //     fill(0, 255, 0);
  //     noStroke();
  //     circle(keypoint.x, keypoint.y, 10);
  //   }
  // }
  
  
  updatePixels()
}

function getPixel(x,y) {
  return y * width + x;
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}