export class Ball {
    constructor(world, width, height, color, x, y) {
       this.world = world;
        this.width = width;
       this.height = height;
       this.color = color;
       this.x = x;
       this.y = y;
        this.vx;
        this.vy;

       this.element = document.createElement("div");
       this.element.style.width = `${width}px`;
       this.element.style.height = `${height}px`;
       this.element.style.border = `solid 3px ${color}`;
       this.element.style.position = "absolute";
       this.element.style.left = `${this.x}px`;
       this.element.style.top = `${this.y}px`;
      world.appendChild(this.element);

    }
}
