// 
let boardSize = 4;

class Block{
    constructor(letter,x,y) {
        this.letter = letter;
        this.neighbors = [];
        this.x = x;
        this.y = y;
    }
    getNeighbors(grid){
        this.neighbors = grid.filter(block => (Math.abs(block.x-this.x)<=1 && Math.abs(block.y-this.y)<=1) && !(block.x ==this.x && block.y == this.y));
    }
}

function printGrid(grid) {
    // context.clearRect(0,0,width,height);
    // context.fillStyle = "#C1C1C1";
    // context.fillRect(0,0,40,40);
    let gameSpace = document.querySelector("#gameSpace")
    for(let y=0;y<boardSize;y++) {
        let row = grid.filter(block => block.y == y)
        console.log(row.map(block => block.letter).join(" "))
        let rowElement = document.createElement("tr");
        gameSpace.appendChild(rowElement)
        for (let x=0;x<boardSize;x++){
            let block =document.createElement("td")
            block.textContent = row[x].letter;
            rowElement.appendChild(block)
        }
    }
}
function makeBlocks(grid) {
    let count = 0;
    
    let newDice = ['AAEEGN',"ELRTTY","AOOTTW","ABBJOO","EHRTVW","CIMOTU","DISTTY","EIOSST","DELRVY","ACHOPS","HIMNQU","EEINSU","EEGHNW","AFFKPS","HLNNRZ","DEILRX","AAEEGN","ACHOPS","AFFKPS","DEILRX","DELRVY","EEGHNW","EIOSST","HIMNQU","HLNNRZ"];
    let shuffledDice = [];
    while (newDice.length >0){
        randomDie = newDice.splice(Math.floor(Math.random()*newDice.length),1)

        shuffledDice.push(randomDie)
    }

    letters = shuffledDice.map(die => die[0].charAt(Math.floor(Math.random()*die[0].length)))
    
    for (let i=0;i<boardSize;i++){
        for (let t=0;t<boardSize;t++) {
            grid.push(new Block(letters[count],i,t))
            count++;
        }
    }
    grid.forEach(block => block.getNeighbors(grid));
    
}

function traverse(words,word,block) {
    word.push(block);
    if(word.length >= 3) {
        words.push(word)
    }
    
    block.neighbors.forEach(neighbor => {
        if ((!word.includes(neighbor)) && word.length <=7){
            traverse(words,word.map(x => x),neighbor);
        }
    })


}

function convertWordToString(w){
    return w.map(block => block.letter).join("")

}

function remember(jsondata,grid) {

    let startTime = Date.now();
    let wordList = new Set(JSON.parse(jsondata));
    // let wordList = JSON.parse(jsondata);

    // wordList =wordList.filter(x => x.length<8)
    
    let words = [];
    let word = [];

    
    // console.log(grid[1])
    for (let i = 0;i<grid.length;i++) {
        word = [];
        traverse(words,word,grid[i])
        // outWords = outWords.concat(words);
    }
    // grid.forEach(block => {
    //     traverse(words,word,block);
    // });
    wordsAsStrings = words.map(convertWordToString);
    console.log(wordsAsStrings);
    filteredWords = wordsAsStrings.filter(word => wordList.has(word.toLowerCase()));
    finalWords = [];
    for (let i=0;i<filteredWords.length;i++){

        if(!finalWords.includes(filteredWords[i])){
            finalWords.push(filteredWords[i]);
        }
    }
    finalWords.sort();
    document.querySelector("#loadMessage").remove();
    startButton = document.createElement('button');
    startButton.textContent = "Start Game";
    startButton.setAttribute("id","startButton")
    startButton.addEventListener("click",x => startGame(grid));
    document.querySelector("#instruction").appendChild(startButton);
    // startGame(grid)
    console.log(finalWords);
    // console.log(wordList)
    console.log(`time taken: ${Date.now()-startTime} milliseconds`)
}
function displayTimer() {
    timer = document.createElement("h4");
    timer.textContent = "60";
    document.querySelector("#results").appendChild(timer);
    let timerId =setInterval(x =>updateTimer(timer,timerId),1000);
}
function updateTimer(timer,timerId) {
    if(parseInt(timer.textContent)<=0) {
        clearTimeout(timerId);
        displayResults()
        document.querySelector("input").remove();
    }
    else {

        timer.textContent = parseInt(timer.textContent)-1;
    }
}
function reloadGame() {
    document.querySelector("#gameSpace").innerHTML='';
    document.querySelector("#results").innerHTML='';
    document.querySelector("#playersWords").innerHTML = '';
    loadGame();
}
function verifySubmittedWords() {
    [].slice.call(document.querySelector("#playersWords").children).forEach( function (child) {
        if(!finalWords.includes(child.textContent.toUpperCase())) {
            // child.setAttribute("class","red");
            child.remove();
        }
        
    });
}
function displayResults() {
    let results =document.createElement("p");
    verifySubmittedWords();
    results.textContent = `You found ${document.querySelector("#playersWords").childElementCount} out of ${finalWords.length} possible words.\nAll Possible Words:\n${finalWords.join()}`;
    document.querySelector("#results").appendChild(results);
    reloadButton = document.createElement("button");
    reloadButton.textContent = "Reload Game";
    reloadButton.setAttribute("id","startButton");
    reloadButton.addEventListener("click",reloadGame);
    document.querySelector("#instruction").appendChild(reloadButton);
}

function submitWord(event) {
    if(event.code == "Enter"){
        let inputBox = document.querySelector("input");
        if(inputBox.value.length>0){

            let word = document.createElement("li");
            word.textContent = inputBox.value;
            
            document.querySelector("#playersWords").appendChild(word);
            inputBox.value = '';
        }
    }
}
function startGame(grid) {
    
    document.querySelector("#startButton").remove();
    displayTimer();
    printGrid(grid);
    let inputBox =document.createElement("input");
    document.addEventListener("keydown",submitWord)
    document.querySelector("#playerArea").appendChild(inputBox);
}
function loadGame() {
    let grid = [];
    makeBlocks(grid);
    document.querySelector("#startButton").remove(); 
    let loading = document.createElement("p")
    loading.innerHTML = "<span id=loadMessage>Loading...</span>"
    document.querySelector("#instruction").appendChild(loading);
    fetch("./word_list.json")
    .then(response => {
        return response.json();
    })
    .then(jsondata => remember(jsondata,grid));
}


