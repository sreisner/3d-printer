(function() {
    angular.module('gallery', [])
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
        .directive('gallery', function () {
            return {
                restrict: 'E',
                templateUrl: '../directives/gallery.html',
                controller: 'GalleryController',
                controllerAs: 'galleryCtrl'
            };
        });
}());
