export class Cell {
  constructor(i, j, id, value = null) {
    this.i = i;
    this.j = j;
    this.id = id;
    this.value = value;
  }

  pos(i, j) {
    if (i !== undefined && j != undefined) {
      this.i = i;
      this.j = j;
    }

    return [this.i, this.j];
  }
}

export class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.score = 0;

    this.raw = Array.apply(null, { length: height }).map((_, i) => (
      Array.apply(null, { length: width }).map((_, j) => this._newEmptyCell(i, j))
    ));
    this._addRandomValue();
    this._addRandomValue();
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
      this._addRandomValue();
      this._setCellPos();
    }
  }

  cells() {
    let cells = {};
    this.raw.forEach(row => row.forEach(cell => cells[cell.id] = cell));
    return cells;
  }

  _setCellPos() {
    this.raw.forEach((row, i) =>
      row.forEach((cell, j) => cell.pos(i, j))
    );
  }

  _processCell(i, j, di, dj) {
    if (!this.raw[i][j]) { return; }
    if (!this.raw[i][j].value) { return; }

    const ti = i + di, tj = j + dj;
    if (!this._inGrid(ti, tj)) { return; }

    switch ((this.raw[ti][tj] || {}).value) {
    case undefined:
    case null:
      this.raw[ti][tj] = this.raw[i][j];
      this.raw[i][j] = this._newEmptyCell(i, j);
      this._processCell(ti, tj, di, dj);
      break;
    case this.raw[i][j].value:
      this.raw[ti][tj] = this.raw[i][j];
      this.raw[i][j] = this._newEmptyCell(i, j);
      this.raw[ti][tj].value *= 2;
      this.score += this.raw[ti][tj].value;
      break;
    default:
      return;
    }

    this.anyMoved = true;
  }

  _inGrid(i, j) {
    return i >= 0 && j >= 0 && i < this.height && j < this.width;
  }

  _newEmptyCell(i, j) {
    return this._newCell(i, j, null);
  }

  _addRandomValue() {
    const emptyCells = this._emptyCells();
    if (emptyCells.length == 0) {
      return;
    }
    const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.raw[i][j] = this._newCell(i, j, this._newValue());
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

  _newCell(i, j, value) {
    if (!this._lastCellId) {
      this._lastCellId = 0;
    }

    this._lastCellId++;

    return new Cell(i, j, this._lastCellId, value);
  }

  _newValue() {
    return Math.random() > 0.9 ? 4 : 2;
  }
}
