(function() {
    'use strict';

    var app = angular.module('printApp', []);

    var galleryController = app.controller('GalleryController', ['$http', function($http) {
        this.prints = [];
        var gallery = this;

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
})();
