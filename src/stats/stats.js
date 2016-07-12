angular.module('angular-login.stats', ['angular-login.grandfather'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.stats', {
                url: '/stats',
                templateUrl: 'stats/stats.tpl.html',
                controller: 'StatsController',
                controllerAs: 'statfmt',
                accessLevel: accessLevels.dlaf
            })
            .state('app.statsmaraude', {
                url: '/statsmaraude',
                templateUrl: 'stats/statsmaraude.tpl.html',
                controller: 'StatsMaraudeController',
                controllerAs: 'statmrd',
                accessLevel: accessLevels.public
            })
            .state('app.statsfc', {
                url: '/statsfc',
                templateUrl: 'stats/statsfc.tpl.html',
                controller: 'StatsFCController',
                controllerAs: 'statfcc',
                accessLevel: accessLevels.dlaf
            })
    })
    .controller('StatsController', function ($scope, loginService, $http, $log, NgTableParams) {
        $scope.year = 2016;
        var self = this;

        $scope.getDonne = function () {
            var url_search = 'http://' + $scope.url + '/stats/formations?year=' + $scope.year + '&F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);

            $http.get(url_search).
                success(function (response) {
                    $scope.donnee = angular.fromJson(response);                                      
                    self.tableformateurs = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.formateurs.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.formateurs
                        }
                    );
                    self.tableassistants = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.assistants.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.assistants
                        }
                    );     
                });
        };

        $scope.getDonne();
    })
    .controller('StatsMaraudeController', function ($scope, loginService, $http, $log, NgTableParams) {
        $scope.year = 2016;
        var self = this;

        $scope.getDonne = function () {
            var url_search = 'http://' + $scope.url + '/stats/maraude?year=' + $scope.year + '&F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);

            $http.get(url_search).
                success(function (response) {
                    $scope.donnee = angular.fromJson(response);                    
                    self.tablechef = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.chef.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.chef
                        }
                    );
                    self.tablemaraudeur = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.maraudeur.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.maraudeur
                        }
                    );     
                });
        };

        $scope.getDonne();
    })
    .controller('StatsFCController', function ($scope, loginService, $http, $log, NgTableParams) {
        $scope.year = 2016;
        var self = this;
          
        $scope.getDonne = function () {
            var url_search = 'http://' + $scope.url + '/stats/fc?year=' + $scope.year + '&F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);

            $http.get(url_search).
                success(function (response) {
                    $scope.donnee = angular.fromJson(response);
                    self.tableformateurs = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.formateurs.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.formateurs
                        }
                    );
                    self.tableparticipants = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.participants.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.participants
                        }
                    );     
                });
        };

        $scope.getDonne();
    });
