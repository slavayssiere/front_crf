angular.module('angular-login.google', ['angular-login.grandfather'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.google', {
        url: '/',
        templateUrl: 'google/google.tpl.html',
        controller: 'GoogleController',
        controllerAs: 'googlesessions'
      });
  })
  .controller('GoogleController', function ($scope, $log, $auth, $http, NgTableParams) {

    var url_search = 'http://' + $scope.url_google + '/sheets/state?token=' + $auth.getToken();
    $log.info('URI: ' + url_search);
    var self = this;

    $scope.wait = true;

    $http.get(url_search).
      success(function (response) {
        $scope.data = response;
        self.tablesessions = new NgTableParams(
          {
            sorting: { date: "desc" },
            page: 1,
            count: $scope.data.length
          }, {
            counts: [], // hide page counts control
            total: 1,  // value less than count hide pagination
            dataset: $scope.data
          }
        );
        $scope.wait = false;
      });

  });
