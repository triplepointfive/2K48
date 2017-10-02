$(function() {
  class Grid {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      this.raw = Array(height);
      for (let i = 0; i < height; i++) {
        this.raw[i] = Array.apply(null, Array(width));
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
      <div class="game-grid">
        <div class="row" v-for="row in grid">
          <div class="col grid-cell" v-for="cell in row">
            <div class="value">
              {{ cell }}
            </div>
          </div>
        </div>
      </div>
    `,
    props: ['grid']
  };

  const GameFieldComponent = {
    template: `
      <div class="game-field">
        <game-grid :grid="rawGrid"></game-grid>
        <div class="game-controls">
          <a href="#" class="btn btn-secondary" @click="add">
            Add
          </a>
        </div>
      </div>
    `,
    components: {
      'game-grid': GameGridComponent
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
        this.grid.addRandomValue();
        this.$set(this.rawGrid, this.grid.raw);
      },
      move: function(direction) {
        this.grid.addRandomValue();
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
