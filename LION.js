class LION {
  
  constructor(x, y, size, images) {
    //load frames
    this.pos = createVector(x, y)
    this.speed = 5
    
    this.size = size
    this.frames = images
    this.frameDelay = 6;
    this.frameCounter = 0;
    this.currentFrame = 0;
    
    this.frameWidth = images[0].width * size;
    this.frameHeight = images[0].height * size;

    this.moving = false
    this.dir = 1
    
  }
  
  
  render() {
    push();  // Save the current drawing state
    //color('red')
    //circle(this.pos.x, this.pos.y, 5)
    translate(this.pos.x, this.pos.y);  // Move to the lion's position
    if (this.moving == false) {
      this.currentFrame = 0
    }
    if (this.dir == -1) {
      scale(-1, 1);  // Flip the lion horizontally if moving left
      image(this.frames[this.currentFrame], -this.frameWidth, 0, 
            this.frameWidth, this.frameHeight);
    } else {
      image(this.frames[this.currentFrame], 0, 0, 
            this.frameWidth, this.frameHeight);
    }

    pop();  // Restore the original drawing state
  }
  
  
  move(dir) {
    this.moving = true
    if (dir.y == 0){
      this.dir = dir.x;
    }
    this.pos.add(createVector(dir.x * speed, dir.y * speed))
    this.frameCounter++;

    if (this.frameCounter >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.frameCounter = 0;
    }
  }
  
  update() {
    //check that the lion doesn't go outside of bounding box
    let minX = 40
    let minY = height / 2 + 30
    let maxX = width - this.frameWidth - 70
    let maxY = height - (this.frameHeight * (13/19)) - 30

    if (this.pos.x < minX) {
      this.pos.x = minX
    }
    if (this.pos.y < minY) {
      this.pos.y = minY
    }
    if (this.pos.x > maxX) {
      this.pos.x = maxX
    }
    if (this.pos.y > maxY) {
      this.pos.y = maxY
    }
  }
  
  atEdge() {
    if (this.pos.x < 50 || this.pos.x > 
        width - this.frameWidth - 70) {
      return true
    }
    else {return false}
  }
}