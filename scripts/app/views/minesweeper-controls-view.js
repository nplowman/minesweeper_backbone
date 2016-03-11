var app = app || {};

(function($) {
  'use strict';

  app.MinesweeperControlsView = Backbone.View.extend({
    el: '.minesweeper-controls',
    template: _.template($('#controls-template').html()),
    elapsed_time: 0,
    timer_loop: 0,
    events: {
      'click .minesweeper-controls__reset-button' : 'clickResetButton',
    },
    initialize: function() {
      this.render();
      this.subscribeToCellClicked();
      this.subscribeToMineTriggered();
      this.subscribeToMineFlagged();
      this.subscribeToMineUnflagged();
    },
    render: function() {
      var markup = this.template({
        mines_remaining: app.Globals.mines_remaining,
        elapsed_time: this.elapsed_time
      });

      this.$el.html(markup);

      return this;
    },
    subscribeToCellClicked: function(cell) {
      var view = this;
      app.Events.on('CellClicked', function() {
        if (view.elapsed_time === 0) {
          view.startTimer();
        }
      });
    },
    subscribeToMineTriggered: function(cell) {
      var view = this;
      app.Events.on('MineTriggered', function() {
        view.stopTimer();
      });
    },
    subscribeToMineFlagged: function(cell) {
      var view = this;
      app.Events.on('MineFlagged', function() {
        app.Globals.mines_remaining--;
        view.render();
      });
    },
    subscribeToMineUnflagged: function(cell) {
      var view = this;
      app.Events.on('MineUnflagged', function() {
        app.Globals.mines_remaining++;
        view.render();
      });
    },
    startTimer: function(){
      var view = this;
      this.timer_loop = setInterval(function() {
        view.elapsed_time++;
        $('.minesweeper-controls__timer', this.$el).text(view.elapsed_time);
      }, 1000);
    },
    stopTimer: function() {
      clearInterval(this.timer_loop);
      this.render();
    },
    resetTimer: function() {
      clearInterval(this.timer_loop);
      this.elapsed_time = 0;
      this.render();
    },
    resetMineCounter: function() {
      app.Globals.mines_remaining = app.Globals.mine_count;
      this.render();
    },
    clickResetButton: function() {
      this.resetTimer();
      this.resetMineCounter();
      app.Events.trigger('ResetButtonClicked');
    }
  });
})(jQuery);