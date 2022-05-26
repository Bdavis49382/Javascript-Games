import makeBlocks from "./blocks.js";
import findAllWords from "./wordFinder.js";
let boardSize = 4;
let finalWords = [];

updateButton()
function updateButton() {
  
  document.querySelector("#gameMode").textContent = boardSize == 4?"You Are Playing: Regular Boggle":"You Are Playing: Big Boggle";
}
window.changeGameMode = function changeGameMode() {
  boardSize = boardSize == 4 ? 5 : 4;
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
  timer.textContent = "60";
  document.querySelector("#results").appendChild(timer);
  let timerId = setInterval((x) => updateTimer(timer, timerId), 1000);
}
function updateTimer(timer, timerId) {
  if (parseInt(timer.textContent) <= 0) {
    clearTimeout(timerId);
    displayResults();
    document.querySelector("input").remove();
  } else {
    timer.textContent = parseInt(timer.textContent) - 1;
  }
}
function reloadGame() {
  document.querySelector("#gameSpace").innerHTML = "";
  document.querySelector("#results").innerHTML = "";
  document.querySelector("#playersWords").innerHTML = "";
  window.loadGame();
}
function verifySubmittedWords() {
  [].slice
    .call(document.querySelector("#playersWords").children)
    .forEach(function (child) {
      if (!finalWords.includes(child.textContent.toUpperCase())) {
        // child.setAttribute("class","red");
        child.remove();
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
  if (event.code == "Enter") {
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
  document.addEventListener("keydown", submitWord);
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
  finalWords = findAllWords(listFile,grid,finalWords);
    // .then((response) => {
    //   return response.json();
    // })
    // .then((jsondata) => finalWords = findAllWords(jsondata, grid,finalWords));
}
