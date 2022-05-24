
class Block {
    constructor(letter, x, y) {
      this.letter = letter;
      this.neighbors = [];
      this.x = x;
      this.y = y;
    }
    getNeighbors(grid) {
      this.neighbors = grid.filter(
        (block) =>
          Math.abs(block.x - this.x) <= 1 &&
          Math.abs(block.y - this.y) <= 1 &&
          !(block.x == this.x && block.y == this.y)
      );
    }
  }
const makeBlocks = (grid,boardSize) => {
    let count = 0;
  
    let newDice = [
      "AAEEGN",
      "ELRTTY",
      "AOOTTW",
      "ABBJOO",
      "EHRTVW",
      "CIMOTU",
      "DISTTY",
      "EIOSST",
      "DELRVY",
      "ACHOPS",
      "HIMNQU",
      "EEINSU",
      "EEGHNW",
      "AFFKPS",
      "HLNNRZ",
      "DEILRX",
      "AAEEGN",
      "ACHOPS",
      "AFFKPS",
      "DEILRX",
      "DELRVY",
      "EEGHNW",
      "EIOSST",
      "HIMNQU",
      "HLNNRZ",
    ];
    let shuffledDice = [];
    while (newDice.length > 0) {
      let randomDie = newDice.splice(Math.floor(Math.random() * newDice.length), 1);
  
      shuffledDice.push(randomDie);
    }
  
    let letters = shuffledDice.map((die) =>
      die[0].charAt(Math.floor(Math.random() * die[0].length))
    );
  
    for (let i = 0; i < boardSize; i++) {
      for (let t = 0; t < boardSize; t++) {
        grid.push(new Block(letters[count], i, t));
        count++;
      }
    }
    grid.forEach((block) => block.getNeighbors(grid));
  }
  export default makeBlocks;