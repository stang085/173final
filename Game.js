class Game {
  constructor(lion, background, meatballs, screenH, screenW) {
    this.lion = lion;
    this.background = background;
    //this.keys = keys
    this.meatballs = meatballs;
    this.WORLDX = 0;
    this.screenH = screenH;
    this.screenW = screenW;
    this.meatballCounter = 0;
  }

  update() {
    //use the position of the bacground to update the WORLDX
    this.WORLDX = this.background.x * -1;
    //update the position of the meatballs
    for (var i in this.meatballs) {
      meatballs[i].update(this.WORLDX);
      //check for collisions
      //if there was a collision, 
      //then add to meatball counter to display
      let collide = this.checkCollision(
        this.lion.pos.x,
        this.lion.pos.y,
        this.lion.frameHeight * (13 / 19),
        this.lion.frameWidth,
        this.meatballs[i].screenX,
        this.meatballs[i].y,
        this.meatballs[i].size,
        this.meatballs[i].size
      );
      if (collide) {
        meatballs[i].eaten = true;
        meatballs[i].replaceMeatball(
          random(50, WORLD_WIDTH - 100),
          this.WORLDX
        );
        this.meatballCounter += 1;
      }
    }
  }

  render() {
    this.background.render();
    this.lion.render();

    //render meatballs

    for (var i in meatballs) {
      let meatballX = this.meatballs[i].screenX;
      if (meatballX > 0 && meatballX < this.screenW) {
        this.meatballs[i].render();
      }
    }
  }

  checkCollision(ax, ay, aH, aW, bx, by, bH, bW) {

    if (ax < bx + bW && ax + aW > bx && 
        ay < by + bH && ay + aH > by) {
      // Collision detected!
      return true;
    } else {
      // No collision
      return false;
    }
  }
}
