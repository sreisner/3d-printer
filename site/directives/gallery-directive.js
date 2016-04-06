(function() {
  'use strict';

  angular.module('gallery')
    .directive('gallery', function() {
      return {
        restrict: 'E',
        templateUrl: 'directives/templates/gallery.html',
        controller: 'GalleryController',
        controllerAs: 'galleryCtrl'
      };
    });
}());
