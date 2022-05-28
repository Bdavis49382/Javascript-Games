
function traverse(words, word, block,shortenedWordList3,shortenedWordList5) {
  word.push(block);
  
  if (word.length == 3 && !shortenedWordList3.has(convertWordToString(word).toLowerCase())){
    return;
  }
  else if (word.length == 5 && !shortenedWordList5.has(convertWordToString(word).toLowerCase())){
    return
  }
  else if (word.length >= 3) {
    words.push(word);
  }

  block.neighbors.forEach((neighbor) => {
    if (!word.includes(neighbor) && word.length <= 11) {
      traverse(
        words,
        word.map((x) => x),
        neighbor,shortenedWordList3,
        shortenedWordList5
      );
    }
  });
}

function convertWordToString(w) {
  return w.map((block) => block.letter).join("");
}

const findAllWords = async function (jsondata, grid, finalWords) {
  let startTime = Date.now();
  let wordList = new Set(JSON.parse(jsondata));
  let shortenedWordList3 = JSON.parse(jsondata).map(w => w.slice(0,3));
  let shortenedWordList5 = JSON.parse(jsondata).map(w => w.slice(0,5));
  shortenedWordList5 = new Set(shortenedWordList5);
  shortenedWordList3 = new Set(shortenedWordList3);

  let words = [];
  let word = [];

  for (let i = 0; i < grid.length; i++) {
    word = [];
    traverse(words, word, grid[i],shortenedWordList3,shortenedWordList5);
  }

  let wordsAsStrings = words.map(convertWordToString);
  console.log(wordsAsStrings);
  let filteredWords = wordsAsStrings.filter((word) =>
    wordList.has(word.toLowerCase())
  );
  finalWords = new Set(filteredWords);
  finalWords = Array.from(finalWords);
  finalWords.sort();
  document.querySelector("#loadMessage").remove();
  let startButton = document.createElement("button");
  startButton.textContent = "Start Game";
  startButton.setAttribute("id", "startButton");
  startButton.addEventListener("click", (x) => startGame(grid));
  document.querySelector("#instruction").appendChild(startButton);

  console.log(finalWords);

  console.log(`time taken: ${Date.now() - startTime} milliseconds`);
  return verifyList(finalWords);
};

async function verifyList(foundWords) {
  let outWords = new Array();
  foundWords.forEach(async (word) => {
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      outWords.push(word);
      
    }
    else {

    }

  })


  return outWords;
}

export default findAllWords;
