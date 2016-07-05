angular.module('angular-login.recyclage', ['angular-login.grandfather'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.recyclageul', {
                url: '/recyclageul',
                templateUrl: 'recyclage/recyclage.tpl.html',
                controller: 'RecyclageController',
                accessLevel: accessLevels.dlaf
            })
            .state('app.recyclagedd', {
                url: '/recyclagedd',
                templateUrl: 'recyclage/recyclage.tpl.html',
                controller: 'RecyclageDDController',
                accessLevel: accessLevels.ddaf
            });
    })
    .controller('RecyclageController', function ($scope, loginService, $http, $log, datalib) {

        $scope.list_comp = datalib.getHash();

        $scope.search = function () {

            var url_search = 'http://' + $scope.url + '/benevoles/recyclages/' + $scope.competence + '/' + $scope.list_comp[$scope.competence] + '?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
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
                                    $scope.data.out = $scope.data.out.concat(block.out);

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


        $scope.searchemail = function () {

            $scope.searchemail.working = true;
            var url_search = 'http://' + $scope.url + '/benevoles/emails?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession;
            $log.info('URI: ' + url_search);
            var req = {
                method: 'POST',
                url: url_search,
                data: angular.toJson($scope.data)
            }

            $http(req).
                success(function (response) {
                    var dataemail = angular.fromJson(response);
                    $scope.emails = datalib.getEmailList(dataemail);
                    $scope.searchemail.working = false;
                }
                );
        };

    })
    .controller('RecyclageDDController', function ($scope, loginService, $http, $log, datalib) {

        $scope.list_comp = datalib.getHash();

        $scope.search = function () {

            var url_search = 'http://' + $scope.url + '/benevoles/recyclagesdd/' + $scope.competence + '/' + $scope.list_comp[$scope.competence] + '?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession;
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
                                    $scope.data.out = $scope.data.out.concat(block.out);

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


        $scope.searchemail = function () {

            $scope.searchemail.working = true;
            var url_search = 'http://' + $scope.url + '/benevoles/emails?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession;
            $log.info('URI: ' + url_search);
            var req = {
                method: 'POST',
                url: url_search,
                data: angular.toJson($scope.data)
            }

            $http(req).
                success(function (response) {
                    var dataemail = angular.fromJson(response);
                    $scope.emails = datalib.getEmailList(dataemail);
                    $scope.searchemail.working = false;
                }
                );
        };

    });

