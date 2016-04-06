(function() {
  'use strict';

  angular.module('app')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '../templates/pages/home/index.html'
        })
        .when('/login', {
          templateUrl: '../templates/pages/login/index.html'
        })
        .otherwise({
          templateUrl: '../templates/pages/home/index.html'
        });
    }]);
})();
