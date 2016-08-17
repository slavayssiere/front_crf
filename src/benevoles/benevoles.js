angular.module('angular-login.benevoles', ['angular-login.grandfather'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.benevoles', {
                url: '/benevoles',
                templateUrl: 'benevoles/benevoles.tpl.html',
                controller: 'BenevolesController',
                accessLevel: accessLevels.user
            })
            .state('app.benevolesadmin', {
                url: '/benevolesadmin',
                templateUrl: 'benevole/benevolesadmin.tpl.html',
                controller: 'BenevolesAdminController',
                controllerAs: 'benadmin',
                accessLevel: accessLevels.user
            });;
    })
    .controller('BenevolesController', function ($scope, loginService, $http, $log, BenevolesDataFactory) {

        $scope.displayEmails=false;

        var url_search = 'http://' + $scope.url + '/benevoles?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession + '&ul=' + loginService.user.utilisateur.structure.id;
        $log.info('URI: ' + url_search);

        $http.get(url_search).
            success(function (response) {
                $scope.data = angular.fromJson(response);
            });

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
    
    .controller('BenevolesAdminController', function ($scope, loginService, $http, $log, NgTableParams) {

        var self = this;
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
                                                                                        
                                    self.tablelist = new NgTableParams(
                                        {
                                            sorting: { nom: "asc" },
                                            page: 1,
                                            count: $scope.data.list.length
                                        },{
                                            counts: [], // hide page counts control
                                            total: 1,  // value less than count hide pagination
                                            dataset: $scope.data.list
                                        }
                                    );
                                });
                        }
                    }
                });
                
            $scope.change = function (person, type){
            
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
