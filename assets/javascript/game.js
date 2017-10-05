import Vue from 'vue/dist/vue.esm';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import Hammer from 'hammerjs';
import 'hammer-time';
import { Cell, Grid } from 'core';

$(function() {
  const GameGridCellComponent = {
    template: '#game-grid-cell',
    props: ['i', 'j', 'value'],
    methods: {
      blink: function() {
        $(this.$el)
          .fadeIn( "slow" );
        // .effect('highlight', {}, 300);
      }
    },
    computed: {
      cellClasses: function() {
        if (this.value) {
          return [`-cell-${this.value}`];
        }
      },
      gridElement: function() {
        return $(`.grid-cell.-empty[data-row='${this.i}'][data-column='${this.j}']:first`);
      },
      element: function() {
        return $(this.$el);
      }
    },
    mounted: function() {
      console.log("beforeUpdate", this.value, this.i, this.j);
      this.element.hide();
      this.element.css(this.gridElement.position());

      if (this.value) {
        this.element.promise().done(this.blink);
      }
    },
    beforeUpdate: function() {
      console.log("beforeUpdate", this.value, this.i, this.j);
      if (this.value) {
        this.element.animate(this.gridElement.position(), 300);
        this.element.show();
      }
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
