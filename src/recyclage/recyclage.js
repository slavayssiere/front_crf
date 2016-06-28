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
  $scope.search = function () {
    
    $log.info('competence search',$scope.competence);
    
    var url_search = 'http://'+$scope.url+'/benevoles/recyclages/'+$scope.competence+'?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
    $log.info('URI: ' + url_search);
    
    $scope.search.working = true;
    
    $http.get(url_search).
        success(function(response){
        $log.info('data', response);
        $scope.data = angular.fromJson(response);
        $scope.search.working = false;
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
            $log.info(dataemail);
            $scope.emails = $scope.getEmailList(dataemail); 
            $scope.searchemail.working = false;
            }
        );     
    };
  
})
.controller('RecyclageDDController', function ($scope, loginService, $http, $log) {
  $scope.search = function () {
    
    $log.info('competence search',$scope.competence);
    
    var url_search = 'http://'+$scope.url+'/benevoles/recyclagesdd/'+$scope.competence+'?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession;
    $log.info('URI: ' + url_search);
    
    $scope.search.working = true;
    
    $http.get(url_search).
        success(function(response){
        $log.info('data', response);
        $scope.data = angular.fromJson(response);
        $scope.search.working = false;
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
            $log.info(dataemail);
            $scope.emails = $scope.getEmailList(dataemail); 
            $scope.searchemail.working = false;
            }
        );     
    };
  
});

