const canvas = document.getElementById("screen")
const context = canvas.getContext('2d');
const width = canvas.width-10;
const height = canvas.height-10;

const STARTINGPOS = [40,200];

let playerPos; //player position in x and y
let playerDirection; //a direction represented as a "vector" of x and y. Starts out as up
let tailPieces = [];
let tailLength;

let applePos;



let startButton = document.createElement("Button")
startButton.innerText = "Start Game!"
startButton.addEventListener("click",startGame)
document.querySelector("body").appendChild(startButton);


function startGame() {
    startButton.remove()

    playerPos = STARTINGPOS;
    playerDirection = [0,-10];
    tailLength = 5;

    applePos = [90,100];

    document.addEventListener("keydown",handleInput)


   const clock =setInterval(function () {          //run these functions every 100 milliseconds
    buildgrid();
    updatePlayer(clock);
    drawActors();
},100); 
}

function handleInput(event) {
    
    if ( event.code == "KeyW" && playerDirection.join() != [0,10].join()) {
        playerDirection = [0,-10];
    }
    else if (event.code == "KeyD" && playerDirection.join() != [-10,0].join()) {
        playerDirection = [10,0];
    }
    else if (event.code == "KeyS" && playerDirection.join() != [0,-10].join()) {
        playerDirection = [0,10];
    }
    else if (event.code == "KeyA" && playerDirection.join() != [10,0].join()) {
        playerDirection = [-10,0];
    }
}

function buildgrid() {
    context.clearRect(0, 0, canvas.width,canvas.height);
    context.strokeStyle = 'black';
    for(let i=10.5;i<canvas.width;i+=10){

        context.beginPath();
        context.moveTo(i,0)
        context.lineTo(i,canvas.height)
        context.stroke();
    }
    for(let i=10.5;i<canvas.width;i+=10){

        context.beginPath();
        context.moveTo(0,i)
        context.lineTo(canvas.width,i)
        context.stroke();
    }
}

function updatePlayer(clock) {
    tailPieces.push(playerPos);

    if (tailPieces.length > tailLength) {
        tailPieces.splice(0,1);
    }
 
    if (playerPos.join().trim() === applePos.join().trim()){
        tailLength++;
        spawnApple();
    }

    playerPos = playerPos.map((value,index) => value += playerDirection[index]);
    
    if(playerIsColliding()){
        endGame(clock)
        
    }
}

function endGame(clock) {
    tailPieces = [];
    score = document.createElement("h2");
    score.innerText = `Your score: ${tailLength}`;
    document.querySelector("body").appendChild(score);
    startButton = document.createElement("Button");
    startButton.innerText = "Restart Game";
    startButton.addEventListener("click",startGame);
    document.querySelector("body").appendChild(startButton);
    clearInterval(clock)
}

function drawActors() {
    
    context.fillStyle = "green";
    context.fillRect(playerPos[0],playerPos[1], 10, 10);
    tailPieces.forEach(tailPiece => context.fillRect(tailPiece[0],tailPiece[1],10,10))

    context.fillStyle = "red";
    context.fillRect(applePos[0],applePos[1],10,10);
}

function playerIsColliding() {
    let x = playerPos[0];
    let y = playerPos[1];
    if (x<0 || x>width || y<0 || y> height) {
        return true;
    }
    if (tailPieces.some(piece => piece.join() == playerPos.join())) {
        return true;
    }
}

function spawnApple() {
    const x = Math.round(Math.random() * (width/10));
    const y = Math.round(Math.random() * (height/10));
    applePos = [x*10,y*10];
}