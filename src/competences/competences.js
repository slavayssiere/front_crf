angular.module('angular-login.competences', ['angular-login.grandfather'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.competences', {
                url: '/competences',
                templateUrl: 'competences/competences.tpl.html',
                controller: 'CompetencesController',
                accessLevel: accessLevels.user
            })
            .state('app.roles', {
                url: '/roles',
                templateUrl: 'competences/roles.tpl.html',
                controller: 'RolesController',
                accessLevel: accessLevels.user
            });
    })
    .controller('CompetencesController', function ($scope, loginService, $http, $log, BenevolesDataFactory) {

        $scope.displayEmails=false;
        
        $scope.search = function () {

            var url_search = 'http://' + $scope.url + '/benevoles/competences/' + $scope.competence + '/yes?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);
            $scope.search.working = true;

            $http.get(url_search + '&page=0').
                success(function (response) {
                    $scope.data = angular.fromJson(response);
                    if ($scope.data.pages > 1) {
                        for (i = 1; i != $scope.data.pages; i++) {
                            $http.get(url_search + '&page=' + i).
                                success(function (res) {
                                    block = angular.fromJson(res);
                                    $scope.data.list = $scope.data.list.concat(block.list);

                                    if (i == $scope.data.pages) {
                                        $scope.search.working = false;
                                    }
                                });
                        }
                    }
                    else {
                        $scope.search.working = false;
                    }
                }
                );
        };

        $scope.searchWithout = function () {

            var url_search = 'http://' + $scope.url + '/benevoles/competences/' + $scope.competence + '/no?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);
            $scope.search.working = true;

            $http.get(url_search + '&page=0').
                success(function (response) {
                    $scope.data = angular.fromJson(response);
                    if ($scope.data.pages > 1) {
                        for (i = 1; i != $scope.data.pages; i++) {
                            $http.get(url_search + '&page=' + i).
                                success(function (res) {
                                    block = angular.fromJson(res);
                                    $scope.data.list = $scope.data.list.concat(block.list);

                                    if (i == $scope.data.pages) {
                                        $scope.search.working = false;
                                    }
                                });
                        }
                    }
                    else {
                        $scope.search.working = false;
                    }
                }
                );
        };


        $scope.searchComplexe = function () {

            var url_search = 'http://' + $scope.url + '/benevoles/competences/' + $scope.competence + '/no/' + $scope.competence2 + '/yes?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);
            $scope.search.working = true;

            $http.get(url_search + '&page=0').
                success(function (response) {
                    $scope.data = angular.fromJson(response);
                    if ($scope.data.pages > 1) {
                        for (i = 1; i != $scope.data.pages; i++) {
                            $http.get(url_search + '&page=' + i).
                                success(function (res) {
                                    block = angular.fromJson(res);
                                    $scope.data.list = $scope.data.list.concat(block.list);

                                    if (i == $scope.data.pages) {
                                        $scope.search.working = false;
                                    }
                                });
                        }
                    }
                    else {
                        $scope.search.working = false;
                    }
                }
                );
        };

       
        $scope.getEmails = function(){
            $scope.searching = true;
            BenevolesDataFactory.searchemail($scope.data).then(function(coordonees){
                for (i = 0; i < coordonees.list.length; i++) {
                    $scope.data.list[i]['coordonees']=coordonees.list[i];
                }
                $scope.displayEmails=true;
                $scope.searching = false;
                $scope.emails = BenevolesDataFactory.parseemails();
            }, function(msg){
                $log.info(msg);
                $scope.searching = false;
            });
        };

    })
    .controller('RolesController', function ($scope, loginService, $http, $log, BenevolesDataFactory, datalib) {

        $scope.list_role = datalib.getHashRole();
        $scope.displayEmails=false;

        $scope.search = function () {

            var url_search = 'http://' + $scope.url + '/benevoles/roles/' + $scope.role + '?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
            $log.info('URI: ' + url_search);
            $scope.search.working = true;

            $http.get(url_search + '&page=0').
                success(function (response) {
                    $scope.data = angular.fromJson(response);
                    if ($scope.data.pages > 1) {
                        for (i = 1; i != $scope.data.pages; i++) {
                            $http.get(url_search + '&page=' + i).
                                success(function (res) {
                                    block = angular.fromJson(res);
                                    $scope.data.list = $scope.data.list.concat(block.list);

                                    if (i == $scope.data.pages) {
                                        $scope.search.working = false;
                                    }
                                });
                        }
                    }
                    else {
                        $scope.search.working = false;
                    }
                }
                );
        };

        $scope.getEmails = function(){
            $scope.searching = true;
            BenevolesDataFactory.searchemail($scope.data).then(function(coordonees){
                for (i = 0; i < coordonees.list.length; i++) {
                    $scope.data.list[i]['coordonees']=coordonees.list[i];
                }
                $scope.displayEmails=true;
                $scope.searching = false;
                $scope.emails = BenevolesDataFactory.parseemails();
            }, function(msg){
                $log.info(msg);
                $scope.searching = false;
            });
        };

    });
