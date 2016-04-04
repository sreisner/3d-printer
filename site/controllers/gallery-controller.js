(function () {
    'use strict';

    angular.module('gallery')
        .controller('GalleryController', ['$http', function ($http) {
            var controller = this;
            controller.prints = [];
            controller.currentPrint = null;

            $http.get('http://localhost:8080/api/print')
                .then(function (response) {
                    controller.prints = response.data;
                })
                .catch(function (reason) {
                    console.log(reason);
                });

            this.showModal = function (print) {
                controller.currentPrint = print;
                $('#print-modal').modal('show');
            };
        }]);
}());
