export class Control {
    constructor(controlName) {
        this.controlName = controlName;
        this.element = document.createElement("div")
        
        const nameDiv = document.createElement("div") 
        nameDiv.innerText = `${this.controlName}`
        this.element.appendChild(nameDiv)

        this.inputElement = document.createElement("input");
        this.element.appendChild(this.inputElement);

        this.buttonElement = document.createElement("button");
        this.buttonElement.innerText = "Submit";
        this.element.appendChild(this.buttonElement);

        const controlPanel = document.getElementById("controlPanel")
        controlPanel.appendChild(this.element);
    }
}