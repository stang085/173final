class Meatball {
  constructor(x, worldX, y, size, image) {
    this.screenX = x
    this.worldX = worldX
    this.y = random(-400,0)
    this.size = size
    this.image = image
    this.eaten = false
    this.speed = random(2,5)
  }
  
  render() {
    if (this.eaten == false) {
      image(this.image, this.screenX, this.y, this.size, this.size)
    }
    
  }
  
  update(WORLDX) {
    //update the screen position of the meatball
    this.screenX = this.worldX - WORLDX
    this.y += this.speed
    if (this.y > 600) {
      this.y = -5
    }
  }
  
  replaceMeatball(MeatballWorldX, WORLDX) {
    //makes the meatball appear up above, sets new X and speed
    //console.log("replaceMeatball")
    //console.log(MeatballWorldX)
    if (this.eaten == true) {
      this.worldX = MeatballWorldX
      this.y = random(-400,0)
      this.update(WORLDX)
      this.speed = random(2,5)
      this.eaten = false
    }
  }
  
}