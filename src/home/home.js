angular.module('angular-login.home', ['angular-login.grandfather'])
.config(function ($stateProvider) {
  $stateProvider
    .state('app.home', {
      url: '/',
      templateUrl: 'home/home.tpl.html',
      controller: 'HomeController'
    });
})
.controller('HomeController', function ($scope, loginService) {
  $scope.ls = loginService;
  $scope.users = angular.fromJson(loginService.user);
});
