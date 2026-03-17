import { Camera } from "./Camera";
//import {Novy} from "./Novy";
//import { Object } from "./Object";
import {Control} from "./control";
//import { SlotMachine } from "./SlotMachine"; 
//import { Tetris } from "./Tetris";   
import { Ball } from "./ball";
import { Floor } from "./Floor";
//import { mountChess } from "./chess";

 
const hiButton = document.getElementById("hiButton");
const scene = document.getElementById("scene");
const world = document.getElementById("world");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const chessButton = document.getElementById("chessButton");

 
const camera = new Camera(scene, world, 0, 0);
 
//const slot = new SlotMachine(world, 20, 20);
//const tetris = new Tetris(world, 1000, 20);

const ball = new Ball(world, 50, 50, "red", 500, 500);

// create a floor that spans the world width and is 40px tall at the bottom of the world
const worldRect = world.getBoundingClientRect ? world.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
const floorHeight = 40;
const floorY = (worldRect.height || window.innerHeight) - floorHeight;
const floor = new Floor(world, worldRect.width || window.innerWidth, floorHeight, "#666", 0, floorY);

// create a right wall (vertical) 40px wide at the right edge of the world
const wallWidth = 40;
const wallX = (worldRect.width || window.innerWidth) - wallWidth;
const rightWall = new Floor(world, wallWidth, worldRect.height || window.innerHeight, "#666", wallX, 0);



const xControl = new Control("souřadnice x");
xControl.buttonElement.onclick = () => {
    ball.element.style.left = `${xControl.inputElement.value}px`;
}
const yControl = new Control("souřadnice y");
yControl.buttonElement.onclick = () => {
    ball.element.style.top = `${yControl.inputElement.value}px`;
}

let lastTime = document.timeline.currentTime
let ax = 10
let ay = 20
let animID = 0;
function simulate (timestamp) {
    if (lastTime === 0) lastTime = timestamp;
    let dt = (timestamp - lastTime )/1000
    lastTime = timestamp
 
    ball.vx = ball.vx + ax * dt;
    ball.vy = ball.vy + ay * dt;
 
    ball.x = ball.x + ball.vx * dt;
    ball.y = ball.y + ball.vy * dt;
     // collision with floor (simple AABB vs AABB-ish using bottom of ball)
    const ballBottom = ball.y + ball.height; // ball.height exists from constructor param
    const floorTop = floor.getTop();

    if (ballBottom >= floorTop) {
        // push ball back to sit on top of floor
        ball.y = floorTop - ball.height;
        // invert Y velocity with restitution
        const restitution = 0.7; // bounciness 0..1
        ball.vy = -ball.vy * restitution;
        // small threshold to zero-out tiny bounces
        if (Math.abs(ball.vy) < 1) ball.vy = 0;
    }

    // collision with right wall
    const ballRight = ball.x + ball.width;
    const wallLeft = rightWall.x;
    if (ballRight >= wallLeft) {
        // push ball back to be flush with wall
        ball.x = wallLeft - ball.width;
        // invert X velocity with restitution
        const restitutionX = 0.7;
        ball.vx = -ball.vx * restitutionX;
        // small threshold to zero-out tiny horizontal velocities
        if (Math.abs(ball.vx) < 0.5) ball.vx = 0;
    }

    ball.element.style.left = `${ball.x}px`;
    ball.element.style.top = `${ball.y}px`;

    animID = requestAnimationFrame(simulate);
}

let counter1 = 1;
start.addEventListener("click", (e) => {
    requestAnimationFrame(simulate);
});

stop.addEventListener("click", (e) => {
    cancelAnimationFrame(animID);
});

reset.addEventListener("click", (e) => {
    // reset to the ball's stored initial position and zero velocity
    ball.reset();
});

let counter = 0;
 
hiButton.innerHTML = `${counter}`;

// Chess button: create a chess container and mount the game
chessButton.addEventListener('click', () => {
    // remove existing chess container if any
    let cc = document.getElementById('chessContainer');
    if (cc) cc.remove();
    cc = document.createElement('div');
    cc.id = 'chessContainer';
    cc.style.position = 'absolute';
    cc.style.right = '10px';
    cc.style.top = '10px';
    cc.style.background = 'white';
    cc.style.padding = '8px';
    cc.style.zIndex = 9999;
    scene.appendChild(cc);
    mountChess(cc);
});
 
/*const testDiv = new Object(camera, 300, 300, 200, 200);
 
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
});*/