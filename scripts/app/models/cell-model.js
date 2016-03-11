var app = app || {};
(function($) {
  "use strict";
  app.Cell = Backbone.Model.extend({
    defaults: {
      //Possible States: unclicked, flagged, mine-triggered, empty
      state: "unclicked",
      containsMine: false,
      row: null,
      col: null,
      adjacentMines: null
    }
  });
})(jQuery);
