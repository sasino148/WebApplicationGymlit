export class Object {
   /* constructor(camera, x, y, width = 100, height = 100, parent = null) {
        this.camera = camera;
        this.world = camera.world;
 
        this.parent = parent;

        this.localPosition = {x:x, y:y}; // relativní pozice k rodiči
        this.size = {width:width, height:height};
 
        this.isDragging = false;
        this.dragOffset = {x: 0, y: 0}; // posunutí mezi pozicí objektu a kurzorem myši
 
        this.element = document.createElement("div");
        this.element.style.width = width + "px";
        this.element.style.height = height + "px";
 
        if (parent) {
            parent.element.appendChild(this.element);
        } else {
            this.world.appendChild(this.element);
        }
 
        this.updateScreenPosition();
        this.registerEvents();
    }
 
    getWorldPosition() {  // výpočet souřadnic objektu
        if (!this.parent) return this.localPosition;
 
        return {
            x: this.parent.getWorldPosition().x + this.localPosition.x,
            y: this.parent.getWorldPosition().y + this.localPosition.y
        };
    }
 
    registerEvents() {
        this.element.addEventListener("mousedown", (e) => {
            if (e.button !== 0) return;
 
            e.stopPropagation();
            e.preventDefault();
 
            this.isDragging = true;
 
            const getWorldPosition = this.getWorldPosition();
 
            this.dragOffset.x = e.clientX - (getWorldPosition.x + this.camera.position.x);
            this.dragOffset.y = e.clientY - (getWorldPosition.y + this.camera.position.y);
        });
 
        window.addEventListener("mousemove", (e) => {
            if (!this.isDragging) return;
 
            const worldX = e.clientX - this.camera.position.x - this.dragOffset.x;
            const worldY = e.clientY - this.camera.position.y - this.dragOffset.y;
 
            if (this.parent) {
                const parentWorld = this.parent.getWorldPosition();
                this.localPosition.x = worldX - parentWorld.x;
                this.localPosition.y = worldY - parentWorld.y;
            } else {
                this.localPosition.x = worldX;
                this.localPosition.y = worldY;
            }
 
            this.updateScreenPosition();
        });
 
        window.addEventListener("mouseup", () => {
            this.isDragging = false;
        });
    }
 
    updateScreenPosition() { // výpočet posunutí pozice
        const worldPosition = this.getWorldPosition();
 
        const screenX = worldPosition.x + this.camera.position.x;
        const screenY = worldPosition.y + this.camera.position.y;
 
        this.element.style.left = `${screenX}px`;
        this.element.style.top = `${screenY}px`;
    }
 
    onCameraMove() {
        this.updateScreenPosition();
    }*/
}
 