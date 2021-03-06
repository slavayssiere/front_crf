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
    .controller('RecyclageController', function ($scope, loginService, $http, $log, datalib, BenevolesDataFactory) {

        $scope.list_comp = datalib.getHashComp();
        $scope.displayEmails=false;

        $scope.search = function () {

            var url_search = 'http://' + $scope.url + '/benevoles/recyclages/' + $scope.competence + '/' + $scope.list_comp[$scope.competence] + '?ul=' + loginService.user.utilisateur.structure.id;
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
    .controller('RecyclageDDController', function ($scope, loginService, $http, $log, datalib, BenevolesDataFactory) {

        $scope.list_comp = datalib.getHashComp();
        $scope.displayEmails=false;

        $scope.search = function () {

            var url_search = 'http://' + $scope.url + '/benevoles/recyclagesdd/' + $scope.competence + '/' + $scope.list_comp[$scope.competence] + '?dd=75';
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

