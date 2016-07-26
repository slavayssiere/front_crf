angular.module('angular-login.google', ['angular-login.grandfather'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.google', {
        url: '/',
        templateUrl: 'google/google.tpl.html',
        controller: 'GoogleController'
      });
  })
  .controller('GoogleController', function ($scope, $log, $auth, $http) {
    
    var url_search = 'http://' + $scope.url_google + '/sheet';
    $log.info('URI: ' + url_search);
    var req = {
      method: 'GET',
      url: url_search,
      data: {
        token: $auth.getToken()
      }
    }

    $http(req).
      success(function (response) {
        $scope.data = angular.fromJson(response);
      });

  });
