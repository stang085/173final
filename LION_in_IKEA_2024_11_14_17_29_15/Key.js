class Key {
  constructor(x, y, size, image) {
    this.x = x
    this.y = y
    this.size = size
    this.image = loadImage('key2.png')
  
  }
  
  render() {
    image(this.image, this.x, this.y, this.size, this.size)
  }
}