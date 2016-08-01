angular.module('angular-login.google', ['angular-login.grandfather'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.sessions', {
        url: '/sessions',
        templateUrl: 'google/google.tpl.html',
        controller: 'GoogleController',
        controllerAs: 'googlesessions'
      })
      .state('app.sessioncreate', {
        url: '/sessioncreate',
        templateUrl: 'google/create.tpl.html',
        controller: 'GCreateController',
        controllerAs: 'gcc'
      })
      .state('app.sessionscript', {
        url: '/sessionscript',
        templateUrl: 'google/scripts.tpl.html',
        controller: 'GScriptController',
        controllerAs: 'gss'
      });
  })
  .controller('GScriptController', function ($scope, $log, $auth, $http) {

    var url_search = 'http://' + $scope.url_google + '/api/sheets/launchscript?token=' + $auth.getToken();
    $log.info('URI: ' + url_search);
    var self = this;

    $scope.wait = true;

    $http.get(url_search).
      success(function (response) {
        $scope.data = response;
        $scope.wait = false;
      });

  })
  .controller('GoogleController', function ($scope, $log, $auth, $http, NgTableParams) {

    var url_search = 'http://' + $scope.url_google + '/api/sheets/state?token=' + $auth.getToken();
    $log.info('URI: ' + url_search);
    var self = this;

    $scope.wait = true;

    var req = {
        method: 'GET',
        url: url_search,
        timeout: 90000
      }
      
    $http(req).
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
        
        $scope.wait = true;
      })
      .error(function (response){
        $scope.wait = false;
        $log.info(response);
        $scope.data = response;
      });

  })
  .controller('GCreateController', function ($scope, $log, $auth, $http) {

    var self = this;
    $scope.session = {
      working: false,
      wrong: false
    };

    $scope.wait = true;
    //{"formateur":"Maureen Mahe","address":null,"date":1469138400000,"id":0,"type":"PSC1","google_id":"1W2a8PELm7wNsNLZpjRNn57UkMPgmj0jhXxD83rcLcBY","google_name":"ANNULEE - 2016 - 07 - 22 PSC1 Maureen","inscriptions":[],"emptyRows":[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"nb_empty":15}

    // Controller
    $scope.isAuthenticated = function () {
      return $auth.isAuthenticated();
    };

    $scope.create = function () {
      $scope.data = "Waiting...";
      var url_search = 'http://' + $scope.url_google + '/api/sheets/create?token=' + $auth.getToken();
      $log.info('URI: ' + url_search);

      var req = {
        method: 'POST',
        url: url_search,
        data: {
          formateur: $scope.session.formateur,
          address: "12 rue Auguste Laurent 75011 Paris",
          date: $scope.session.date,
          type: $scope.session.type,
          heure: $scope.session.heure
        }
      }

      $http(req).
        success(function (response) {
          $scope.data = response;
        });
    }

  });
