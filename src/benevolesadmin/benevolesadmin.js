angular.module('angular-login.benevolesadmin', ['angular-login.grandfather'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.benevolesadmin', {
                url: '/benevolesadmin',
                templateUrl: 'benevolesadmin/benevolesadmin.tpl.html',
                controller: 'BenevolesAdminController',
                accessLevel: accessLevels.dlaf
            });
    })
    .controller('BenevolesAdminController', function ($scope, loginService, $http, $log) {

        var url_search = 'http://' + $scope.url + '/benevoles/all?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
        $log.info('URI: ' + url_search);

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
    });
