var app = app || {};

(function($) {
  'use strict';

  app.CellView = Backbone.View.extend({
    initialize: function() {

    },
    template: _.template($('#cell-template').html()),
    render: function() {
      var id = this.getElementID();
      var classes = this.getClasses();
      var markup = this.template({
        id: id,
        classes: classes.join(' '),
        row: this.model.get('row'),
        col: this.model.get('col'),
        adjacent_mines: this.model.get('adjacentMines') || '',
      });

      return markup;
    },
    getClasses: function() {
      var classes = ['grid__grid-row__cell'];
      var state = this.model.get('state');
      switch (state) {
        case 'empty':
          classes.push('empty');
          break;
        case 'mine-triggered':
          classes.push('mine-triggered');
          break;
        case 'flagged':
          classes.push('flagged');
          break;
      }
      return classes;
    },
    getElementID: function() {
      var row = this.model.get('row');
      var col = this.model.get('col');
      var id = 'cell-' + row + '-' + col;
      return id;
    }
  });
})(jQuery);