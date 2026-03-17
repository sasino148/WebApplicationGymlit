export class Floor {
    // world: DOM element to attach to
    // width, height: dimensions in px
    // color: CSS color string
    // x, y: top-left world coordinates
    constructor(world, width, height, color = "#888", x = 0, y = 0) {
        this.world = world;
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;

        this.element = document.createElement("div");
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.element.style.background = color;
        this.element.style.position = "absolute";
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        this.world.appendChild(this.element);
    }

    // returns top Y coordinate of the floor (world coords)
    getTop() {
        return this.y;
    }

    // basic rectangle for collision checks
    getRect() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}

