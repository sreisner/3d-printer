(function() {
  'use strict';

  const API_URL = 'http://ec2-52-207-246-149.compute-1.amazonaws.com:8080';
  angular.module('gallery')
    .controller('GalleryController', ['$http', function($http) {
      var self = this;
      self.prints = [];
      self.currentPrint = null;

      $http.get(`${API_URL}/api/print`)
        .then(function(response) {
          self.prints = response.data;
        })
        .catch(function(reason) {
          console.log(reason);
        });

      this.showModal = function(print) {
        self.currentPrint = print;
        $('#print-modal').modal('show');

        $http.get(`${API_URL}/api/category/${print.categoryId}`)
          .then(function(response) {
            self.currentPrint.categoryName = response.data.name;
          })
          .catch(function(reason) {
            self.currentPrint.categoryName = 'Unable to retrieve category.';
            console.log(reason);
          });

        self.currentPrint.downloadName = print.title
          .substring(0, 20)
          .replace(/[^a-zA-Z\s]*/g, '')
          .replace(/[\s]+/g, '-') + '.stl';
      };
    }]);
})();
