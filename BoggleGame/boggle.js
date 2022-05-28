import makeBlocks from "./blocks.js";
import findAllWords from "./wordFinder.js";
let boardSize = 4;
let finalWords = [];
let seconds = 180;

updateButton()
function updateButton() {
  
  document.querySelector("#gameMode").textContent = boardSize == 4?"You Are Playing: Regular Boggle":"You Are Playing: Big Boggle";
}
window.changeGameMode = function changeGameMode() {
  boardSize = boardSize == 4 ? 5 : 4;
  if (boardSize == 4){
    document.querySelector("#box").style.width = "200px";
    document.querySelector("#box").style.height = "235px";
    document.querySelector("#box").style.backgroundColor = "blue";
  }
  else {
    document.querySelector("#box").style.width = "280px";
    document.querySelector("#box").style.height = "295px";    
    document.querySelector("#box").style.backgroundColor = "#1291db";
  }
  updateButton();
}

function printGrid(grid) {

  let gameSpace = document.querySelector("#gameSpace");
  for (let y = 0; y < boardSize; y++) {
    let row = grid.filter((block) => block.y == y);
    console.log(row.map((block) => block.letter).join(" "));
    let rowElement = document.createElement("tr");
    gameSpace.appendChild(rowElement);
    for (let x = 0; x < boardSize; x++) {
      let block = document.createElement("td");
      block.textContent = row[x].letter;
      rowElement.appendChild(block);
    }
  }
}

function displayTimer() {
  
  let timer = document.createElement("h4");
  timer.setAttribute('id','timer');
  document.querySelector("#gridBox").appendChild(timer);
  let timerId = setInterval((x) => updateTimer(timer, timerId), 1000);
}
function updateTimer(timer, timerId) {
  if (seconds <= 0) {
    clearTimeout(timerId);
    displayResults();
    document.querySelector("input").remove();
    document.querySelector("#submitButton").remove();
    document.querySelector("#timer").remove();
  } else {
    seconds -= 1;
    timer.textContent = `${Math.floor(seconds/60)}:${seconds%60}`;
  }
}
function reloadGame() {
  seconds = 180;
  document.querySelector("#gameSpace").innerHTML = "";
  document.querySelector("#results").innerHTML = "";
  document.querySelector("#playersWords").innerHTML = "";
  window.loadGame();
}
function verifySubmittedWords() {
  let submittedWords = [];
  [].slice
    .call(document.querySelector("#playersWords").children)
    .forEach(function (child) {
      
      if (!finalWords.includes(child.textContent.toUpperCase())
       || submittedWords.includes(child.textContent.toUpperCase())) {
        child.remove();
      }
      else {
        submittedWords.push(child.textContent.toUpperCase());
      }
    });
}
function displayResults() {
  let results = document.createElement("p");
  verifySubmittedWords();
  results.textContent = `You found ${
    document.querySelector("#playersWords").childElementCount
  } out of ${
    finalWords.length
  } possible words.\nAll Possible Words:\n${finalWords.join()}`;
  document.querySelector("#results").appendChild(results);
  let reloadButton = document.createElement("button");
  reloadButton.textContent = "Reload Game";
  reloadButton.setAttribute("id", "startButton");
  reloadButton.addEventListener("click", reloadGame);
  document.querySelector("#toggleGameMode").innerHTML = `<button id="gameMode" onclick="changeGameMode()"></button>`;
  updateButton();
  document.querySelector("#instruction").appendChild(reloadButton);
}

function submitWord(event) {

  if (event.code == "Enter" || event.type == "click") {
    let inputBox = document.querySelector("input");
    if (inputBox.value.length > 0) {
      let word = document.createElement("li");
      word.textContent = inputBox.value;

      document.querySelector("#playersWords").appendChild(word);
      inputBox.value = "";
    }
  }
}
window.startGame = function startGame(grid) {
  document.querySelector("#startButton").remove();
  displayTimer();
  printGrid(grid);
  let inputBox = document.createElement("input");
  inputBox.setAttribute("placeholder","Press Enter To Submit");
  document.addEventListener("keydown", submitWord);
  let submitButton = document.createElement("button");
  submitButton.addEventListener("click",submitWord);
  submitButton.setAttribute('id','submitButton');
  submitButton.textContent = "Submit";
  document.querySelector("#playerArea").appendChild(submitButton);
  document.querySelector("#playerArea").appendChild(inputBox);
}
window.loadGame =  async function loadGame() {
  document.querySelector("#gameMode").remove();
  let grid = [];
  makeBlocks(grid,boardSize);
  document.querySelector("#startButton").remove();
  let loading = document.createElement("p");
  loading.innerHTML = "<span id=loadMessage>Loading...</span>";
  document.querySelector("#instruction").appendChild(loading);
  let request = await fetch("./word_list.json");
  let listFile = await request.json();
  finalWords = await findAllWords(listFile,grid,finalWords);
  
}
