export class Ball {
    constructor(world, width, height, color, x, y) {
       this.world = world;
    // ensure the visual ball is circular: use the smaller of width/height
    const size = Math.min(width, height);
    this.width = size;
    this.height = size;
       this.color = color;
       this.x = x;
       this.y = y;
        // store the starting position so we can reset to it later
  this.initialX = x;
  this.initialY = y;
        this.vx = 0;
        this.vy = 0;

       this.element = document.createElement("div");
       this.element.style.width = `${width}px`;
       this.element.style.height = `${height}px`;
  // make it look like a ball
  this.element.style.width = `${this.width}px`;
  this.element.style.height = `${this.height}px`;
  this.element.style.border = `solid 3px ${color}`;
  this.element.style.borderRadius = "50%";
  this.element.style.background = color;
  this.element.style.boxSizing = "border-box";
       this.element.style.position = "absolute";
       this.element.style.left = `${this.x}px`;
       this.element.style.top = `${this.y}px`;
      world.appendChild(this.element);

    }

  
  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.vx = 0;
    this.vy = 0;
    
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
  }
}
