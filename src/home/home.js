angular.module('angular-login.home', ['angular-login.grandfather'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.home', {
        url: '/',
        templateUrl: 'home/home.tpl.html',
        controller: 'HomeController'
      });
  })
  .controller('HomeController', function ($scope, loginService, $log, $auth, $http) {
    $scope.ls = loginService;
    
    var displayData = function () {
      var url_search = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + $auth.getToken();
      $log.info('URI: ' + url_search);
      var req = {
        method: 'GET',
        url: url_search
      }

      $http(req).
        success(function (response) {
          $scope.data = angular.fromJson(response);
        })
        .error(function (res){
          $auth.logout();
          $auth.removeToken();
        });
    }

    if($auth.getToken()){
      displayData();
    }
  });
