export class Control {
    constructor(controlName) {
        this.controlName = controlName;
        this.element = document.createElement("div")
        const nameDiv = document.createElement("div")
        nameDiv.innerText = `${this.controlName}`
        this.element.appendChild(nameDiv)

        const controlPanel = document.getElementById("controlPanel")
        controlPanel.appendChild(this.element);
        //this.button = document.createElement("button");
        //this.input;
    }
}