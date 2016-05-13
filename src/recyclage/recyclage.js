angular.module('angular-login.recyclage', ['angular-login.grandfather'])
.config(function ($stateProvider) {
  $stateProvider
    .state('app.recyclage', {
      url: '/recyclage',
      templateUrl: 'recyclage/recyclage.tpl.html',
      controller: 'RecyclageController',
      accessLevel: accessLevels.admin
    });
})
.controller('RecyclageController', function ($scope, loginService, $http) {
  var url_connect = 'http://localhost:4567/connect?username='+loginService.utilisateur.username+'&password='+loginService.utilisateur.password;
  $log.info('test seb',url_connect);
  var loginPromise = $http.get(url_connect, $scope.login);
    
  $scope.data = angular.fromJson(loginService.user);
});
