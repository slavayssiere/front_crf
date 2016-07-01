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
.controller('RecyclageController', function ($scope, loginService, $http, $log) {
    
    var hashComp = new Array();
    hashComp['166']="PSE1";
    hashComp['167']="PSE2";
    hashComp['116']="CIP2";
    hashComp['47']= "OPR";
    hashComp['113']="FIPS";
    hashComp['224']="FIPSEN";
    hashComp['288']="FPS";
    hashComp['286']="FPSC";
    hashComp['284']="PICF";
    hashComp['25']="FCI";
    hashComp['292']="FFPS";
    hashComp['294']="FFPSC";
    hashComp['43']="MORAD";
    hashComp['143']="FIAPS";
    
    
    $scope.search = function () {
        
        var url_search = 'http://'+$scope.url+'/benevoles/recyclages/'+$scope.competence+'/'+hashComp[$scope.competence]+'?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
        $log.info('URI: ' + url_search);
        
        $scope.search.working = true;
        
        $http.get(url_search+'&page=0').
            success(function(response){
                $scope.data = angular.fromJson(response);
                if($scope.data.pages > 1){
                    for (i = 1; i != $scope.data.pages; i++) { 
                        $http.get(url_search+'&page='+i).
                                success(function(res){
                                    block = angular.fromJson(res);                        
                                    $scope.data.list=$scope.data.list.concat(block.list);
                                    $scope.data.out =$scope.data.out.concat(block.out);
                                    
                                    if(i==$scope.data.pages){
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
        var url_search = 'http://'+$scope.url+'/benevoles/emails?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession;
        $log.info('URI: ' + url_search);
        var req = {
            method: 'POST',
            url: url_search,
            data: angular.toJson($scope.data)
        }

        $http(req).
            success(function(response){
                var dataemail = angular.fromJson(response);
                $scope.emails = $scope.getEmailList(dataemail); 
                $scope.searchemail.working = false;
            }
        );     
    };
  
})
.controller('RecyclageDDController', function ($scope, loginService, $http, $log) {
    
    var hashComp = new Array();
    hashComp['166']="PSE1";
    hashComp['167']="PSE2";
    hashComp['116']="CIP2";
    hashComp['47']= "OPR";
    hashComp['113']="FIPS";
    hashComp['224']="FIPSEN";
    hashComp['288']="FPS";
    hashComp['286']="FPSC";
    hashComp['284']="PICF";
    hashComp['25']="FCI";
    hashComp['292']="FFPS";
    hashComp['294']="FFPSC";
    hashComp['43']="MORAD";
    hashComp['143']="FIAPS";

  $scope.search = function () {
    
    var url_search = 'http://'+$scope.url+'/benevoles/recyclagesdd/'+$scope.competence+'/'+hashComp[$scope.competence]+'?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession;
    $log.info('URI: ' + url_search);
    
    $scope.search.working = true;
    
    $http.get(url_search+'&page=0').
        success(function(response){
            $scope.data = angular.fromJson(response);
            if($scope.data.pages > 1){
                for (i = 1; i != $scope.data.pages; i++) { 
                    $http.get(url_search+'&page='+i).
                            success(function(res){
                                block = angular.fromJson(res);                        
                                $scope.data.list=$scope.data.list.concat(block.list);
                                $scope.data.out =$scope.data.out.concat(block.out);
                                
                                if(i==$scope.data.pages){
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
        var url_search = 'http://'+$scope.url+'/benevoles/emails?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession;
        $log.info('URI: ' + url_search);
        var req = {
            method: 'POST',
            url: url_search,
            data: angular.toJson($scope.data)
        }

        $http(req).
            success(function(response){
            var dataemail = angular.fromJson(response);
            $scope.emails = $scope.getEmailList(dataemail); 
            $scope.searchemail.working = false;
            }
        );     
    };
  
});

