angular.module('angular-login.home', ['angular-login.grandfather'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.home', {
        url: '/',
        templateUrl: 'home/home.tpl.html',
        controller: 'HomeController'
      });
  })
  .controller('HomeController', function ($scope, loginService, $log, $auth) {
    $scope.ls = loginService;
    $scope.users = angular.fromJson(loginService.user);


    $scope.loginGoogle = function () {
     	$auth.authenticate('google')
        .then(function (response) {
          $log.info("logged",$auth.isAuthenticated());
          loginService.gw_token=response.data.token;
          loginService.gw_refresh=response.data.refreshToken;
          loginService.gw_expire=response.data.expiresInSeconds;
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
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

  });
