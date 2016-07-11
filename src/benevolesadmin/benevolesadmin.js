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

        $scope.admin = loginService.user.admin.peutAdministrer;
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
                                });
                        }
                    }
                });
                
        $scope.change = function (person, type){
            // {"id":"00001376977M","allow_external":true,"allow_email":true,"prenom":"Sebastien","nom":"LAVAYSSIERE","date_naissance":"1986-03-06T00:00:00","mailMoyenComId":"00001376977M_MAILDOM_2"}
        
            // { "inscriptionsExternes":false,"contactParMail":true,"mailMoyenComId":"00001376977M_MAILDOM_2"}
        
            
            
            
            var url_search = 'http://' + $scope.url + '/benevoles/changeinfo/'+person.id+'?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession;
            var data_struct = {}
            
            if(type=="email")
            {
                data_struct = {
                    inscriptionsExternes: person.allow_external,
                    contactParMail: !person.allow_email,
                    mailMoyenComId: person.mailMoyenComId
                }
                
                person.allow_email = !person.allow_email;
            }
            else
            {
                data_struct = {
                    inscriptionsExternes: !person.allow_external,
                    contactParMail: person.allow_email,
                    mailMoyenComId: person.mailMoyenComId
                }
                
                person.allow_external = !person.allow_external;
            }
            $log.info(data_struct);
            var req = {
                method: 'PUT',
                url: url_search,
                data: angular.toJson(data_struct)
            }

            $http(req).
                success(function (response) {
                        angular.forEach($scope.data.list, function(ben, key) {
                            if(ben.id == person.id){
                                $scope.data.list[key] = person;
                            }
                        });
                });
        };
    });
