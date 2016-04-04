(function () {
    'use strict';

    angular.module('nav')
        .directive('siteNav', function () {
            return {
                restrict: 'E',
                templateUrl: 'directives/templates/site-nav.html',
                controller: 'NavController',
                controllerAs: 'navCtrl'
            };
        });
}());
