(function () {
  'use strict';

  const API_URL = 'http://ec2-52-207-246-149.compute-1.amazonaws.com:8080';
  angular.module('gallery')
    .controller('GalleryController', ['$http', function ($http) {
      var controller = this;
      controller.prints = [];
      controller.currentPrint = null;

      $http.get('${API_URL}/api/print')
        .then(function (response) {
          controller.prints = response.data;
        })
        .catch(function (reason) {
          console.log(reason);
        });

      this.showModal = function (print) {
        controller.currentPrint = print;
        $('#print-modal').modal('show');

        $http.get(`${API_URL}/api/category/${print.categoryId}`)
          .then(function (response) {
            controller.currentPrint.categoryName = response.data.name;
          })
          .catch(function (reason) {
            controller.currentPrint.categoryName = 'Unable to retrieve category.';
            console.log(reason);
          });
      };

      this.getDownloadName = function (print) {
        return print.title
          .substring(0, 20)
          .replace(/[^a-zA-Z\s]*/g, '')
          .replace(/[\s]+/g, '-') + '.stl';
      };
    }]);
}());
