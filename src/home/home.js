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

    $scope.loginGoogle = function () {
     	$auth.authenticate('google')
        .then(function (response) {
          $log.info("logged", $auth.isAuthenticated());
          $auth.setToken(response.data.token);
          loginService.gw_token = response.data.token;
          loginService.gw_refresh = response.data.refreshToken;
          loginService.gw_expire = response.data.expiresInSeconds;
          displayData();
        })
        .catch(function (response) {
          $log.info("error in login");
          $log.info(response);
        });
    };

    $scope.logoutGoogle = function () {
     	$auth.logout();
    };

    // Controller
    $scope.isAuthenticated = function () {
      return $auth.isAuthenticated();
    };

    var displayData = function () {
      var url_search = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + loginService.gw_token;
      $log.info('URI: ' + url_search);
      var req = {
        method: 'GET',
        url: url_search
      }

      $http(req).
        success(function (response) {
          $log.info(response);
          $scope.data = angular.fromJson(response);
        });
    }

    if($auth.getToken()){
      displayData();
    }

  });
