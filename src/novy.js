export class Novy {
    constructor(world, x, y, width, height) {
        this.world = world;
        this.x = x;
        this.y = y;
        this.element = document.createElement("div");

        this.position = { x: x, y: y };
        this.size = { width: width, height: height };
        this.element.style.border = "solid 2px"
        this.element.style.width = "100px"
        this.element.style.height = "100px"

        world.appendChild(this.element);
    }
}