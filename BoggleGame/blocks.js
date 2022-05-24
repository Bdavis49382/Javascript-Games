
export default class Block {
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