var app = app || {};

(function($) {
  'use strict';

  app.MinesweeperGridView = Backbone.View.extend({
    el: '.minesweeper-grid',
    template: _.template($('#grid-template').html()),
    grid_height: 10,
    grid_width: 10,
    grid_cells: null,
    events: {
      'click .grid__grid-row__cell' : 'clickCell',
      'contextmenu .grid__grid-row__cell': 'rightClickCell'
    },
    initialize: function() {
      this.generateGridCells();
      this.plantMines();
      this.subscribeToResetButtonClicked();
      this.checkWinConditions();
      this.render();
    },
    render: function() {
      var rows = [];

      for (var row = 0; row < this.grid_height; row++) {
        rows[row] = [];
        for (var col = 0; col < this.grid_width; col++) {
          var cell = this.grid_cells.findWhere({row: row, col: col});
          var cell_view = new app.CellView({model: cell});
          var cell_markup = cell_view.render();
          rows[row].push(cell_markup);
        }
      }
      var markup = this.template({
        rows: rows
      });
      this.$el.html(markup);
      return this;
    },
    generateGridCells: function() {
      this.grid_cells = new app.CellsCollection();
      for(var row = 0; row < this.grid_height; row++) {
        for (var col = 0; col < this.grid_width; col++) {
          var cell = new app.Cell({
            row: row,
            col: col
          });
          this.grid_cells.add(cell);
        }
      }
    },
    plantMines: function() {
      var mine_count = app.Globals.mine_count;
      var rows = this.grid_height;
      var cols = this.grid_width;

      for(var i = 0; i < mine_count; i++) {
        //Condition to ensure we do not set the same cell twice.
        do {
          var x_coord = _.random(0, cols - 1);
          var y_coord = _.random(0, rows - 1);
          var cell = this.grid_cells.findWhere({row: y_coord, col: x_coord});
        }
        while (cell.get('containsMine') === true);
        cell.set({containsMine: true});
      }
    },
    clickCell: function(e) {
      var cell = this.getClickedCell(e);

      // Case 1: Clicked on Mine
      if (cell.get('containsMine') == true) {
        //Action: Show all mines
        this.showAllMines();
        //Trigger an event
        app.Events.trigger('MineTriggered', cell);
      }
      else {
        this.markAdjacentMines(cell);
      }
      app.Events.trigger('CellClicked', cell);
      this.render();
    },
    rightClickCell: function(e) {
      var cell = this.getClickedCell(e);

      //Toggle Flag On/Off
      if (cell.get('state') == 'flagged') {
        cell.set({state: 'unclicked'});
        this.mines_remaining --;
        app.Events.trigger('MineUnflagged');
      }
      else {
        cell.set({state: 'flagged'});
        this.mines_remaining ++;
        app.Events.trigger('MineFlagged');
      }

      this.render();
    },
    getClickedCell: function(e) {
      var element = $(e.target);
      var row = parseInt(element.attr('data-row'));
      var col = parseInt(element.attr('data-col'));
      var cell = this.grid_cells.findWhere({row: row, col: col});

      return cell;
    },
    showAllMines: function() {
      _.each(this.grid_cells.models, function(cell) {
        if (cell.get('containsMine') === true) {
          cell.set({state: 'mine-triggered'});
        }
      });
    },
    markAdjacentMines: function(cell) {
      //If cell has already been processed, skip.
      if (cell.get('adjacentMines') !== null) {
        return;
      }
      var adj_mine_count = 0;
      var cell_row = cell.get('row');
      var cell_col = cell.get('col');
      var x_low_limit = (cell_col > 0) ? cell_col - 1 : 0;
      var x_high_limit = (cell_col < this.grid_width -1) ? cell_col + 1 : this.grid_width - 1;
      var y_low_limit = (cell_row > 0) ? cell_row -1 : 0;
      var y_high_limit = (cell_row < this.grid_height -1) ? cell_row + 1 : this.grid_height -1;
      for (var x = x_low_limit; x <= x_high_limit; x++) {
        for (var y = y_low_limit; y <= y_high_limit; y++) {
          if (x == cell_col && y == cell_row) {
            continue;
          }
          var adj_cell = this.grid_cells.findWhere({row: y, col: x});
          if (adj_cell.get('containsMine') === true) {
            adj_mine_count ++;
          }
        }
      }
      cell.set({adjacentMines: adj_mine_count, state: 'empty'});
      if (adj_mine_count === 0) {
        cell.set({state: 'empty'});
        //Call recursively for each adjacent cell.
        for (var x = x_low_limit; x <= x_high_limit; x++) {
          for (var y = y_low_limit; y <= y_high_limit; y++) {
            var adj_cell = this.grid_cells.findWhere({row: y, col: x});
            if (adj_cell.get('adjacentMines') === null) {
              this.markAdjacentMines(adj_cell);
            }
          }
        }
      }
    },
    subscribeToResetButtonClicked: function() {
      var view = this;
      app.Events.on('ResetButtonClicked', function() {
        view.initialize();
      });
    },
    checkWinConditions: function() {
      var view = this;

      app.Events.on('CellClicked', function() {
        //Game win condition = all cells not containing mines exposed, w/ no mines triggered.
        var grid_cells = view.grid_cells;
        var total_cells = app.Globals.grid_height * app.Globals.grid_width;
        var safe_cells = total_cells - app.Globals.mine_count;
        var revealed_cells = 0;

        _.each(grid_cells.models, function(cell) {
          if (cell.get('state') === 'empty') {
            revealed_cells++;
          }
        });
        console.log('Revealed Cells: ' + revealed_cells + ' Total Safe Cells: ' + safe_cells);
        if (revealed_cells === safe_cells) {
          view.gameWin();
          app.Events.trigger('GameWin');
        }
      });
    },
    gameWin: function() {
      alert("You Win!");
    }
  });
})(jQuery);

