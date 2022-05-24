function traverse(words, word, block) {
    word.push(block);
    if (word.length >= 3) {
      words.push(word);
    }
  
    block.neighbors.forEach((neighbor) => {
      if (!word.includes(neighbor) && word.length <= 8) {
        traverse(
          words,
          word.map((x) => x),
          neighbor
        );
      }
    });
  }
  
function convertWordToString(w) {
  return w.map((block) => block.letter).join("");
}

const findAllWords = function (jsondata, grid,finalWords) {
  let startTime = Date.now();
  let wordList = new Set(JSON.parse(jsondata));

  // wordList = wordList.filter(x => x.length<17)

  let words = [];
  let word = [];


  for (let i = 0; i < grid.length; i++) {
    word = [];
    traverse(words, word, grid[i]);
    // outWords = outWords.concat(words);
  }
  // grid.forEach(block => {
  //     traverse(words,word,block);
  // });
  let wordsAsStrings = words.map(convertWordToString);
  console.log(wordsAsStrings);
  let filteredWords = wordsAsStrings.filter((word) =>
    wordList.has(word.toLowerCase())
  );
  finalWords = [];
  for (let i = 0; i < filteredWords.length; i++) {
    if (!finalWords.includes(filteredWords[i])) {
      finalWords.push(filteredWords[i]);
    }
  }
  finalWords.sort();
  document.querySelector("#loadMessage").remove();
  let startButton = document.createElement("button");
  startButton.textContent = "Start Game";
  startButton.setAttribute("id", "startButton");
  startButton.addEventListener("click", (x) => startGame(grid));
  document.querySelector("#instruction").appendChild(startButton);

  console.log(finalWords);

  console.log(`time taken: ${Date.now() - startTime} milliseconds`);
  return finalWords;
}

export default findAllWords;