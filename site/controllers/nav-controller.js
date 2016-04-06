(function() {
  'use strict';

  angular.module('nav')
    .controller('NavController', function() {
      this.page = 1;

      this.setPage = function(page) {
        this.page = page;
      };

      this.isSelected = function(page) {
        return this.page === page;
      };
    });
}());
