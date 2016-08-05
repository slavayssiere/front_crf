angular.module('angular-login.stats', ['angular-login.grandfather'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.stats', {
                url: '/stats',
                templateUrl: 'stats/stats.tpl.html',
                controller: 'StatsController',
                controllerAs: 'statfmt',
                accessLevel: accessLevels.user
            })
            .state('app.statsmaraude', {
                url: '/statsmaraude',
                templateUrl: 'stats/statsmaraude.tpl.html',
                controller: 'StatsMaraudeController',
                controllerAs: 'statmrd',
                accessLevel: accessLevels.user
            })
            .state('app.statsfc', {
                url: '/statsfc',
                templateUrl: 'stats/statsfc.tpl.html',
                controller: 'StatsFCController',
                controllerAs: 'statfcc',
                accessLevel: accessLevels.user
            })
            .state('app.statsreseau', {
                url: '/statsreseau',
                templateUrl: 'stats/statsreseau.tpl.html',
                controller: 'StatsReseauController',
                controllerAs: 'statrc',
                accessLevel: accessLevels.user
            })
            .state('app.statsml', {
                url: '/statsml',
                templateUrl: 'stats/statsreseau.tpl.html',
                controller: 'StatsMLController',
                controllerAs: 'statrc',
                accessLevel: accessLevels.user
            })
    })
    .controller('StatsController', function ($scope, loginService, $http, $log, NgTableParams) {
        $scope.year = 2016;
        $scope.wait = false;
        var self = this;

        $scope.getDonne = function () {
            
            $scope.wait = true;
            var url_search = 'http://' + $scope.url + '/stats/formations?year=' + $scope.year + '&F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);

            $http.get(url_search).
                success(function (response) {
                    $scope.donnee = angular.fromJson(response);                     
                    $scope.wait = false;                                     
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
        $scope.wait = false;
        var self = this;

        $scope.getDonne = function () {
            $scope.wait = true;
            var url_search = 'http://' + $scope.url + '/stats/maraude?year=' + $scope.year + '&F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);

            $http.get(url_search).
                success(function (response) {
                    $scope.donnee = angular.fromJson(response); 
                    $scope.wait = false;                   
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
         $scope.wait = false;                   
          
        $scope.getDonne = function () {
            $scope.wait = true;                   
            var url_search = 'http://' + $scope.url + '/stats/fc?year=' + $scope.year + '&F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);

            $http.get(url_search).
                success(function (response) {
                    $scope.donnee = angular.fromJson(response);
                    $scope.wait = false;                   
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
    })
    .controller('StatsReseauController', function ($scope, loginService, $http, $log, NgTableParams) {
        $scope.year = 2016;
        var self = this;
        $scope.wait = false;                   
          
        $scope.getDonne = function () {
            $scope.wait = true;                   
            var url_search = 'http://' + $scope.url + '/stats/reseau?year=' + $scope.year + '&F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);

            $http.get(url_search).
                success(function (response) {
                    $scope.donnee = angular.fromJson(response);
                    $scope.wait = false;                   
                    self.tableci = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.ci.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.ci
                        }
                    );
                    self.tablech = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.ch.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.ch
                        }
                    );     
                    self.tablepse2 = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.pse2.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.pse2
                        }
                    );         
                    self.tablepse1 = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.pse1.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.pse1
                        }
                    );              
                    self.tablepsc = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.psc.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.psc
                        }
                    );     
                });
        };

        $scope.getDonne();
    })
    .controller('StatsMLController', function ($scope, loginService, $http, $log, NgTableParams) {
        $scope.year = 2016;
        var self = this;
        $scope.wait = false;                   
          
        $scope.getDonne = function () {
            $scope.wait = true;                   
            var url_search = 'http://' + $scope.url + '/stats/ml?year=' + $scope.year + '&F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);

            $http.get(url_search).
                success(function (response) {
                    $scope.donnee = angular.fromJson(response);
                    $scope.wait = false;                   
                    self.tableci = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.ci.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.ci
                        }
                    );
                    self.tablech = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.ch.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.ch
                        }
                    );     
                    self.tablepse2 = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.pse2.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.pse2
                        }
                    );         
                    self.tablepse1 = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.pse1.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.pse1
                        }
                    );      
                    self.tablepsc = new NgTableParams(
                        {
                            sorting: { nombre: "desc" },
                            page: 1,
                            count: $scope.donnee.psc.length
                        },{
                            counts: [], // hide page counts control
                            total: 1,  // value less than count hide pagination
                            dataset: $scope.donnee.psc
                        }
                    );                         
                });
        };

        $scope.getDonne();
    });
