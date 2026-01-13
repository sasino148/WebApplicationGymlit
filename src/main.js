import { Camera } from "./Camera";


const hiButton = document.getElementById("hiButton");
const scene = document.getElementById("scene");
const world = document.getElementById("world");

const camera = new Camera(scene, world, 0, 0);

let counter = 0;

hiButton.innerHTML = `${counter}`;

const testDiv = document.createElement("div");
testDiv.classList.add("roundObject");
testDiv.style.width = "200px";
testDiv.style.height = "200px";
testDiv.style.left = "200px";
testDiv.style.top = "200px";
testDiv.style.position = "absolute";
world.appendChild(testDiv);

const round = document.createElement("div");
round.classList.add("round");
round.style.width = "70px";
round.style.height = "70px";
round.style.left = "70px";
round.style.top = "-35px";
round.style.position = "absolute";
testDiv.appendChild(round);

const round2 = document.createElement("div");
round2.classList.add("round");
round2.style.width = "70px";
round2.style.height = "70px";
round2.style.left = "70px";
round2.style.top = "165px";
round2.style.position = "absolute";
testDiv.appendChild(round2);


    round.addEventListener("mousedown", (e) => {
    if(e.button === 0){
        round.style.background = "red";
    } else if(e.button === 2){
        round.style.background = null
    }

    
});