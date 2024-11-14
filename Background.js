class Background {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
  }

  render() {
    image(this.img, this.x, this.y, width * 2, height);
  }

  scrollBackground(lion) {
    if (lion.pos.x > width - lion.frameWidth - 100) {
      this.x -= lion.speed;
      if (this.x < -width) {
        this.x = -width;
      }
      return;
    }
    if (lion.pos.x < 40) {
      this.x += lion.speed;
      if (this.x > 0) {
        this.x = 0;
      }
      return;
    }
  }
}
