var app = app || {};
(function($) {
  app.CellsCollection = Backbone.Collection.extend({
    model: app.Cell
  });
})(jQuery);