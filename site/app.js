(function () {
    'use strict';

    angular.module('home', [])
        .controller('NavController', function () {
            this.page = 1;

            this.setPage = function (page) {
                this.page = page;
            };

            this.isSelected = function (page) {
                return this.page === page;
            };
        })
        .controller('GalleryController', ['$http', function ($http) {
            var controller = this;
            controller.prints = [];
            $http.get('http://localhost:8080/api/print')
                .then(function (response) {
                    controller.prints = response.data;
                })
                .catch(function (reason) {
                    console.log(reason);
                });
        }])
        .directive('galleryItem', function () {
            return {
                restrict: 'E',
                templateUrl: './directives/gallery-item.html',
                controller: 'GalleryController',
                controllerAs: 'galleryCtrl'
            };
        })
        .directive('siteNav', function () {
            return {
                restrict: 'E',
                templateUrl: './directives/site-nav.html',
                controller: 'NavController',
                controllerAs: 'navCtrl'
            }
        });
}());
