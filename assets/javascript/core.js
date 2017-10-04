export class Cell {
  constructor(i, j, id) {
    this.i = i;
    this.j = j;
    this.id = id;
    this.value = null;
  }
}

export class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.score = 0;

    this.raw = Array(height);
    for (let i = 0; i < height; i++) {
      this.raw[i] = new Array(width);
      for (let j = 0; j < width; j++) {
        this.raw[i][j] = new Cell(i, j, i * 4 + j);
      }
    }
    this.addRandomValue();
    this.addRandomValue();
  }

  addRandomValue() {
    const emptyCells = this._emptyCells();
    if (emptyCells.length == 0) {
      return;
    }
    const cellPos = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.raw[cellPos[0]][cellPos[1]].value = this._newValue();
  }

  linear() {
    return [].concat.apply([], this.raw);
  }

  move(direction) {
    this.anyMoved = false;
    this.processed = [];

    switch(direction) {
    case 'right':
      for (let j = this.width - 1; j >= 0; j--) {
        for (let i = this.height - 1; i >= 0; i--) {
          this._processCell(i, j, 0, 1);
        }
      }
      break;
    case 'up':
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          this._processCell(i, j, -1, 0);
        }
      }
      break;
    case 'down':
      for (let i = this.height - 1; i >= 0; i--) {
        for (let j = this.width - 1; j >= 0; j--) {
          this._processCell(i, j, 1, 0);
        }
      }
      break;
    case 'left':
      for (let j = 0; j < this.width; j++) {
        for (let i = 0; i < this.height; i++) {
          this._processCell(i, j, 0, -1);
        }
      }
      break;
    }

    if (this.anyMoved) {
      this.addRandomValue();
    }
  }

  _processCell(i, j, di, dj) {
    if (!this.raw[i][j].value) { return; }

    const ti = i + di, tj = j + dj;
    if (!this._inGrid(ti, tj)) { return; }

    switch (this.raw[ti][tj].value) {
    case null:
      this.raw[ti][tj].value = this.raw[i][j].value;
      this._processCell(ti, tj, di, dj);
      break;
    case this.raw[i][j].value:
      this.raw[ti][tj].value *= 2;
      this.score += this.raw[ti][tj].value;
      break;
    default:
      return;
    }

    this.raw[i][j].value = null;
    this.anyMoved = true;
  }

  _inGrid(i, j) {
    return i >= 0 && j >= 0 && i < this.height && j < this.width;
  }

  _newValue() {
    return Math.random() > 0.9 ? 4 : 2;
  }

  _emptyCells() {
    let emptyCells = [];
    this.raw.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell.value) {
          emptyCells.push([i, j]);
        }
      });
    });
    return emptyCells;
  }
}

