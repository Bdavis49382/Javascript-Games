// 

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
    for(let y=0;y<4;y++) {
        let row = grid.filter(block => block.y == y)
        console.log(row.map(block => block.letter).join(" "))
        let rowElement = document.createElement("tr");
        gameSpace.appendChild(rowElement)
        for (let x=0;x<4;x++){
            let block =document.createElement("td")
            block.innerText = row[x].letter;
            rowElement.appendChild(block)
        }
    }
}
function makeBlocks(grid) {
    let count = 0;
    let newDice = ['AAEEGN',"ELRTTY","AOOTTW","ABBJOO","EHRTVW","CIMOTU","DISTTY","EIOSST","DELRVY","ACHOPS","HIMNQU","EEINSU","EEGHNW","AFFKPS","HLNNRZ","DEILRX"];
    let shuffledDice = [];
    while (newDice.length >0){
        randomDie = newDice.splice(Math.floor(Math.random()*newDice.length),1)

        shuffledDice.push(randomDie)
    }

    letters = shuffledDice.map(die => die[0].charAt(Math.floor(Math.random()*die[0].length)))
    
    for (let i=0;i<4;i++){
        for (let t=0;t<4;t++) {
            grid.push(new Block(letters[count],i,t))
            count++;
        }
    }
    grid.forEach(block => block.getNeighbors(grid));
    printGrid(grid);
}

function traverse(words,word,block) {
    word.push(block);
    if(word.length >= 3) {
        words.push(word)
    }
    
    block.neighbors.forEach(neighbor => {
        if ((!word.includes(neighbor)) && word.length <=5){
            traverse(words,word.map(x => x),neighbor);
        }
    })


}

function convertWordToString(w){
    return w.map(block => block.letter).join("")

}

function remember(jsondata) {

    let startTime = Date.now();
    let wordList = JSON.parse(jsondata);
    wordList =wordList.filter(x => x.length<4)
    let grid = [];
    let words = [];
    let word = [];
    let outWords = [];
    makeBlocks(grid);
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
    filteredWords = wordsAsStrings.filter(word => wordList.includes(word.toLowerCase()));
    console.log(filteredWords);
    // console.log(wordList)
    console.log(`time taken: ${Date.now()-startTime} milliseconds`)
}

function startGame() {
    document.querySelector("#startButton").innerText = "Restart Game";
    fetch("./word_list.json")
    .then(response => {
        return response.json();
    })
    .then(jsondata => remember(jsondata));
}


