let x, y;
let speed = 5;
let frames = [];
let totalFrames = 6;

let direction = 1;
let background_frame;
let background_x = 0;
let background_y = 0;

let frameWidth = 250;
let frameHeight = 250;
let meatballs = [];
let numMeatballs = 10;

let WORLD_WIDTH = 1200;
let WORLD_HEIGHT = 600;

let gameState = "title"; // The initial state is the title screen
let startButton;
let resetButton;
let loadingTime = 4000; // Duration of loading screen in milliseconds (5s)
let playingTime = 20000; //20 seconds of playing time
let startTime;
let endTime;

function preload() {
  for (let i = 0; i < totalFrames; i++) {
    frames.push(loadImage(`frames/pixil-frame-${i}.png`));
  }
  background_frame = loadImage("background2.png");
  key_image = loadImage("key.png");
  meatball_image = loadImage("meatball.png");
  deadLION = loadImage("deadLION.png");
}

function setup() {
  createCanvas(600, 600);

  x = width / 2;
  y = height / 2;
  textFont("Courier New");

  lion = new LION(50, y, 0.5, frames);
  bg = new Background(0, 0, background_frame);

  //create meatballs
  for (let i = 0; i < numMeatballs; i++) {
    let worldX = random(250, WORLD_WIDTH - 100);
    meatballs[i] = new Meatball(
      worldX,
      worldX,
      random(400, height - 50),
      30,
      meatball_image
    );
  }
  startButton = createButton("Start Game");
  startButton.position(width / 2 - 60, height / 2 + 50);
  startButton.size(120, 50);
  startButton.mousePressed(startGame);
  startButton.style("font-family", "Courier New");
  startButton.style("background-color", "#fbda0b");
  startButton.style("border-width", "4px");
  // Attach the startGame function to the button

  resetButton = createButton("Reset");
  resetButton.position(width / 2 - 60, height / 2 + 85);
  resetButton.size(120, 50);
  resetButton.mousePressed(restartGame);
  resetButton.style("font-family", "Courier New");
  resetButton.style("background-color", "#fbda0b");
  resetButton.style("border-width", "4px");
  resetButton.hide();

  game = new Game(lion, bg, meatballs, height, width);
}

function draw() {
  if (gameState === "title") {
    drawTitleScreen(); // Display the title screen
  } else if (gameState == "loading") {
    drawLoadingScreen();
    if (millis() - startTime >= loadingTime) {
      gameState = "loading2";
    }
  } else if (gameState == "loading2") {
    drawLoadingScreen2();
    if (millis() - startTime >= loadingTime * 2) {
      gameState = "main";
      //restart the timer
      startTime = millis();
    }
  } else if (gameState == "main") {
    drawGame();
    if ((playingTime - millis() + startTime) / 1000 <= 0) {
      gameState = "end";
    }
  } else if (gameState == "end") {
    drawEnd();
  }
}

function startGame() {
  gameState = "loading"; // Change the state to "game"
  startButton.hide(); 
  startTime = millis();
}

function restartGame() {
  gameState = "title";
  resetButton.hide();
  startTime = millis();
  setup();
}

function drawTitleScreen() {
  background(0, 87, 183); // Title screen background color
  textAlign(CENTER);
  textSize(50);
  fill(255);
  text("Lion in IKEA!", width / 2, height / 3 + 30);
  // Display the game title
  textSize(20);
  text("Click the button to start:", width / 2, height / 2 + 30); 
}

function drawLoadingScreen() {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("A lion was \nset loose in IKEA!", width / 2, height / 2 - 20);
}

function drawLoadingScreen2() {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text(
    "Your Mission:\n\nEat all the IKEA meatballs\nbefore you get captured!",
    width / 2,
    height / 2 - 45
  ); // Display story screen
}

function drawGame() {
  lion.moving = false;
  lion.update();
  checkKeys();
  game.update();
  game.render();
  elapsedTime = (playingTime - millis() + startTime) / 1000;
  displayTimeBox(elapsedTime);
}

function displayTimeBox(time) {
  // Draw the box
  strokeWeight(4);
  fill(0, 87, 183); // Black box
  rect(15, 15, 150, 40); // Rectangle in top-left corner

  // Display the time inside the box
  fill(255); // White text
  textSize(20);
  textAlign(LEFT, CENTER);
  text("Time: " + nf(time, 0, 2), 25, 35);
}

function drawEnd() {
  background(0, 87, 183); // Title screen background color
  textAlign(CENTER);
  textSize(50);
  fill(255);
  text("Time's up!", width / 2, height / 3 + 50);
  // Display the game title
  textSize(20);
  text("Your Score: " + game.meatballCounter, 
       width / 2, height / 2 + 30);
  textSize(18);
  text("Click the button to reset:", 
       width / 2, height / 2 + 60);
  let scale = 0.45;
  image(
    deadLION,
    width / 2 - (deadLION.width * scale) / 2,
    60,
    deadLION.width * scale,
    deadLION.height * scale
  );
  resetButton.show();
}

function checkKeys() {
  if (keyIsDown(UP_ARROW)) {
    const dir = createVector(0, -1);
    lion.move(dir);
    return;
  } else if (keyIsDown(DOWN_ARROW)) {
    const dir = createVector(0, 1);
    lion.move(dir);
    return;
  } else if (keyIsDown(LEFT_ARROW)) {
    const dir = createVector(-1, 0);
    lion.move(dir);
    if (lion.atEdge()) {
      bg.scrollBackground(lion);
    }
    return;
  } else if (keyIsDown(RIGHT_ARROW)) {
    const dir = createVector(1, 0);
    lion.move(dir);
    if (lion.atEdge()) {
      bg.scrollBackground(lion);
    }
    return;
  }
}
