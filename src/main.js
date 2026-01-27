import { Camera } from "./Camera";
import { Object } from "./Object";
import { SlotMachine } from "./SlotMachine"; 
import { Tetris } from "./Tetris";   
 
const hiButton = document.getElementById("hiButton");
const scene = document.getElementById("scene");
const world = document.getElementById("world");
 
const camera = new Camera(scene, world, 0, 0);
 
const slot = new SlotMachine(world, 20, 20);
const tetris = new Tetris(world, 1000, 20);

let counter = 0;
 
hiButton.innerHTML = `${counter}`;
 
const testDiv = new Object(camera, 300, 300, 200, 200);
 
testDiv.element.classList.add("roundObject");
testDiv.element.style.position = "absolute";
 
world.appendChild(testDiv.element);
 
const round = new Object(camera, 0, 0, 50, 50);
round.element.classList.add("round");
round.element.style.position = "absolute";
 
testDiv.element.appendChild(round.element);
 
round.element.addEventListener("mousedown", (e) => {  
    e.preventDefault();
    if (e.button === 2){
        round.element.style.background = null;
    }
    if(e.button === 0){
        round.element.style.background = "red";
    }
})
 
const round2 = new Object(camera, 50, 50, 50, 50);
round2.element.classList.add("round");
 
round2.element.style.position = "absolute";
 
testDiv.element.appendChild(round2.element);
 
round2.element.addEventListener("mousedown", (e) => {  
    e.preventDefault();
    if (e.button === 2){
        round2.element.style.background = null;
    }
    if(e.button === 0){
        round2.element.style.background = "red";
    }
})
 
hiButton.addEventListener("click", (e) => {
    ++counter;
    hiButton.innerHTML = `${counter}`;
    if(counter === "1"){
        hiButton.style.background = "red";
    } else {
        hiButton.style.background = "green";
    }
 
});

const object_list = [];


novyObjekt.addEventListener("click", (e) => {
    const ob = new Novy(world, 10, 10, 100, 100);
    ob.element.classList.add("objekt");
    object_list.push(ob);
});