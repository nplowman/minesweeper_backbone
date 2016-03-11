var app = app || {};

$(function() {
  app.Events = _.extend({}, Backbone.Events);
  app.Globals = {
    mine_count: 10,
    mines_remaining: 10,
    grid_width: 10,
    grid_height: 10
  };

  "use strict";
  //Initialize App
  new app.MinesweeperGridView();
  new app.MinesweeperControlsView();
});