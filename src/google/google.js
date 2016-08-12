angular.module('angular-login.google', ['angular-login.grandfather'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.sessions', {
        url: '/sessions',
        templateUrl: 'google/google.tpl.html',
        controller: 'GoogleController',
        controllerAs: 'googlesessions',
        accessLevel: accessLevels.admin
      })
      .state('app.sessioncreate', {
        url: '/sessioncreate',
        templateUrl: 'google/create.tpl.html',
        controller: 'GCreateController',
        controllerAs: 'gcc',
        accessLevel: accessLevels.admin
      })
      .state('app.getemails', {
        url: '/getemails',
        templateUrl: 'google/getemails.tpl.html',
        controller: 'GGetEmailController',
        controllerAs: 'gss',
        accessLevel: accessLevels.user
      });
  })
  .controller('GGetEmailController', function ($scope, $log, $auth, $http, NgTableParams) {

    var url_search = 'http://' + $scope.url_google + '/api/sheets/getemails?token=' + $auth.getToken();
    $log.info('URI: ' + url_search);
    var self = this;

    $scope.wait = true;

    $http.get(url_search).
      success(function (response) {
        $scope.table = response;
        $scope.wait = false;
      });

    $scope.getDataSession = function (inscrit) {
      $scope.wait = true;
      $scope.sessioncomplete = false;
      $scope.data = null;
      $scope.selected = inscrit;
      var req = {
        method: 'POST',
        data: {
          date: inscrit.dateFormation,
          type: inscrit.typeFormation
        },
        url: 'http://' + $scope.url_google + '/api/sheets/state?token=' + $auth.getToken()
      }

      $http(req).
        success(function (response) {
          if (response.nb_empty > 0) {
            $scope.disponible = response.emptyRows;
            $scope.google_id = response.google_id;
            $scope.data = response;
          }
          else {
            $scope.sessioncomplete = response;
          }
          $scope.wait = false;
        });
    };

    $scope.inscription = function (row) {
      $scope.wait = true;
      $log.info("inscription de", $scope.selected, "on row ", row);
      var url_inscription = 'http://' + $scope.url_google + '/api/sheets/inscription/' + $scope.google_id + '/' + row + '?token=' + $auth.getToken();
      var req = {
        method: 'POST',
        data: $scope.selected,
        url: url_inscription
      }
      $http(req).
        success(function (response) {
          var indexremove = $scope.table.indexOf($scope.selected);
          var rowDelete = $scope.selected.row;
          $log.info("remove ", indexremove);
          $scope.table.splice(indexremove, 1);
          var url_delete = 'http://' + $scope.url_google + '/api/sheets/getemails/' + $scope.selected.row + '?token=' + $auth.getToken();
          $http.delete(url_delete)
            .success(function (response) {
              for (var tableIndex = 0; tableIndex != $scope.table.length; tableIndex++) {
                if ($scope.table[tableIndex].row > rowDelete) {
                  $scope.table[tableIndex].row--;
                }
              }
              $log.info(response);
            });

          var req = {
            method: 'PUT',
            url: 'http://' + $scope.url_google + '/api/sheets/' + $scope.google_id + '/sendinscrits?token=' + $auth.getToken()
          }
          $http(req).
            success(function (response) {
              $log.info(response);
            });
          $scope.selected = null;
          $scope.google_id = null;
          $scope.disponible = null;
          $scope.sessioncomplete = null;
          $scope.wait = false;
        });
    };

    $scope.anotherDate = function (row) {
      $scope.wait = true;
      var url_search = 'http://' + $scope.url_google + '/api/sheets/complete?token=' + $auth.getToken();
      var req = {
        method: 'POST',
        data: $scope.selected,
        url: url_search
      }
      $http(req).
        success(function (response) {
          var indexremove = $scope.table.indexOf($scope.selected);
          $log.info("remove ", indexremove);
          var url_delete = 'http://' + $scope.url_google + '/api/sheets/getemails/' + $scope.selected.row + '?token=' + $auth.getToken();
          $http.delete(url_delete)
            .success(function (response) {
              $log.info(response);
            });
          $scope.table.splice(indexremove, 1);
          $scope.selected = null;
          $scope.google_id = null;
          $scope.disponible = null;
          $scope.sessioncomplete = null;
          $scope.wait = false;
        });
    };

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

        $scope.wait = false;
      })
      .error(function (response) {
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
          $scope.wait = false;
        });
    }

  });
