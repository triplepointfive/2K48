$(function() {
  class Grid {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      this.raw = Array(height);
      for (let i = 0; i < height; i++) {
        this.raw[i] = new Array(width).fill(null);
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

      this.raw[cellPos[0]][cellPos[1]] = this._newValue();
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
      if (!this.raw[i][j]) { return; }

      const ti = i + di, tj = j + dj;
      if (!this._inGrid(ti, tj)) { return; }

      switch (this.raw[ti][tj]) {
      case null:
        this.raw[ti][tj] = this.raw[i][j];
        this._processCell(ti, tj, di, dj);
        break;
      case this.raw[i][j]:
        this.raw[ti][tj] *= 2;
        break;
      default:
        return;
      }

      this.raw[i][j] = null;
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
        row.forEach((val, j) => {
          if (!val) {
            emptyCells.push([i, j]);
          }
        });
      });
      return emptyCells;
    }
  }

  const GameGridComponent = {
    template: `
      <div class="card-body">
        <div class="grid-row row" v-for="(row, i) in grid">
          <div is="game-grid-cell" v-for="(cell, j) in row" :value="cell" :key="i * 4 + j"></div>
        </div>
      </div>
    `,
    props: ['grid'],
    components: {
      'game-grid-cell': {
        template: `
          <div class="border border-secondary rounded cell text-center col-3">
            <div class="h5 cell-content" :class="value ? ('-cell-' + value) : ''">
              {{ value }}
            </div>
          </div>
        `,
        props: ['value']
      }
    }
  };

  const GameControlsComponent = {
    template: `
      <div class="card-footer game-controls text-center">
        <div class="btn-group">
          <a href="#" class="btn btn-secondary" v-for="direction in directions" @click="move(direction)">
            {{ direction }}
          </a>
        </div>
      </div>
    `,
    data: function() {
      return {
        directions: ['left', 'up', 'down', 'right']
      };
    },
    methods: {
      add: function() {
        this.$emit('add');
      },
      move: function(direction) {
        this.$emit('move', direction);
      },
      keydown: function(e) {
        switch (e.which) {
        case 37:
          this.move('left');
          break;
        case 38:
          this.move('up');
          break;
        case 40:
          this.move('down');
          break;
        case 39:
          this.move('right');
          break;
        }
      }
    },
    mounted: function() {
      $(document).on('keydown', this.keydown);

      let hammertime = new window.Hammer(document, {});
      hammertime.get('swipe').set({ direction: window.Hammer.DIRECTION_ALL });
      hammertime.on('swipeleft', () => this.move('left'));
      hammertime.on('swipeup', () => this.move('up'));
      hammertime.on('swipedown', () => this.move('down'));
      hammertime.on('swiperight', () => this.move('right'));
    },
    beforeDestroy: function() {
      $(document).off('keydown', this.keydown);
    }
  };

  const GameFieldComponent = {
    template: `
      <div class="card game-field">
        <div class="card-header">
          Score: 2048
        </div>
        <game-grid :grid="rawGrid"></game-grid>
        <game-controls @add="add" @move="move"></game-controls>
      </div>
    `,
    components: {
      'game-grid': GameGridComponent,
      'game-controls': GameControlsComponent
    },
    data: function() {
      const grid = new Grid(4, 4);
      return {
        grid: grid,
        rawGrid: grid.raw
      };
    },
    methods: {
      add: function() {
        this.withGrid((grid) => grid.addRandomValue());
      },
      move: function(direction) {
        this.withGrid((grid) => grid.move(direction));
      },
      withGrid: function(callback) {
        callback(this.grid);
        this.$set(this.rawGrid, this.grid.raw);
      }
    }
  };

  new window.Vue({
    el: '#app',
    components: {
      'game-field': GameFieldComponent
    }
  });
});
