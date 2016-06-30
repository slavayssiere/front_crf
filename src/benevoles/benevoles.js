angular.module('angular-login.benevoles', ['angular-login.grandfather'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.benevoles', {
                url: '/benevoles',
                templateUrl: 'benevoles/benevoles.tpl.html',
                controller: 'BenevolesController',
                accessLevel: accessLevels.admin
            });
    })
    .controller('BenevolesController', function ($scope, loginService, $http, $log) {

        var url_search = 'http://' + $scope.url + '/benevoles?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
        $log.info('URI: ' + url_search);

        $http.get(url_search).
            success(function (response) {
                $scope.data = angular.fromJson(response);
            }
            );

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
                    $log.info(dataemail);
                    $scope.emails = $scope.getEmailList(dataemail);
                    $scope.searchemail.working = false;
                }
                );
        };

    });
