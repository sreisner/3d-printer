(function () {
    'use strict';

    angular.module('home', [])
        .controller('GalleryController', ['$http', function ($http) {
            var controller = this;
            controller.prints = [];
            $http.get('http://localhost:8080/api/print')
                .then(function (response) {
                    controller.prints = response.data;
                    console.log(controller.prints);
                })
                .catch(function (reason) {
                    console.log(reason);
                });
        }]);
}());
