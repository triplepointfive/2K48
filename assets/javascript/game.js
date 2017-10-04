import Vue from 'vue/dist/vue.esm';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import Hammer from 'hammerjs';
import 'hammer-time';

$(function() {
  class Grid {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.score = 0;

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
        this.score += this.raw[ti][tj];
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

  const GameGridCellComponent = {
    template: '#game-grid-cell',
    props: ['value', 'i', 'j'],
    methods: {
      blink: function() {
        $(this.$el).effect('highlight', {}, 300);
      }
    },
    computed: {
      cellClasses: function() {
        if (this.value) {
          return [`-cell-${this.value}`];
        }
      },
      element: function() {
        return $(`.grid-cell.-empty[data-row='${this.i}'][data-column='${this.j}']:first`);
      }
    },
    mounted: function() {
      $(this.$el).css(this.element.position());
    },
    beforeUpdate: function() {
      $(this.$el).animate(this.element.position(), 300 );
    }
  };

  const GameGridComponent = {
    template: '#game-grid',
    props: ['grid'],
    components: {
      'game-grid-cell': GameGridCellComponent
    }
  };

  const GameControlsComponent = {
    template: '<div></div>',
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

      let hammertime = new Hammer(document, {});
      hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
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
    template: '#game-field',
    components: {
      'game-grid': GameGridComponent,
      'game-controls': GameControlsComponent
    },
    data: function() {
      const grid = new Grid(4, 4);
      return {
        grid: grid,
        rawGrid: grid.linear()
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
        this.rawGrid = this.grid.linear();
      }
    }
  };

  new Vue({
    el: '#app',
    components: {
      'game-field': GameFieldComponent
    }
  });
});
