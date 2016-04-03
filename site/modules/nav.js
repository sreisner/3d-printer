(function() {
    angular.module('nav', [])
        .controller('NavController', function () {
            this.page = 1;

            this.setPage = function (page) {
                this.page = page;
            };

            this.isSelected = function (page) {
                return this.page === page;
            };
        })
        .directive('siteNav', function () {
            return {
                restrict: 'E',
                templateUrl: '../directives/site-nav.html',
                controller: 'NavController',
                controllerAs: 'navCtrl'
            }
        });
}());
