(function() {
    'use strict';
    var app = angular.module('gallery', []);

    app.controller('GalleryController', ['$http', function($http) {
        var gallery = this;
        gallery.prints = [];

        $http.get('/api/print').then(function(results) {
            if(results.data.error) {
                console.log(results.data.error);
                return;
            }
            var prints = results.data;
            prints.forEach(function(print) {
                print.downloadFileName = print.title.substring(0, 20).split(' ').join('-') + '.stl';
            });
            gallery.prints = prints;
        });
    }]);

    app.directive('gallery', function() {
        return {
            restrict: 'E',
            templateUrl: '/static/directive-templates/gallery.html',
            controller: 'GalleryController',
            controllerAs: 'galleryCtrl'
        };
    });
})();
