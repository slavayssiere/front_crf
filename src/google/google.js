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
    
    var url_search = 'http://' + $scope.url_google + '/files?token='+$auth.getToken();
    $log.info('URI: ' + url_search);
   

    $http.get(url_search).
      success(function (response) {
        $scope.data = angular.fromJson(response);
      });

  });
