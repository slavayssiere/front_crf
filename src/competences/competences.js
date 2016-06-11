angular.module('angular-login.competences', ['angular-login.grandfather'])
.config(function ($stateProvider) {
  $stateProvider
    .state('app.competences', {
      url: '/competences',
      templateUrl: 'competences/competences.tpl.html',
      controller: 'CompetencesController',
      accessLevel: accessLevels.admin
    });
})
.controller('CompetencesController', function ($scope, loginService, $http, $log) {
  
  $scope.data = []
  
  $scope.search = function () {
    
    $log.info('competence search',$scope.competence);
    
    var url_search = 'http://'+$scope.url+'/benevoles/competences/'+$scope.competence+'/yes?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
    $log.info('URI: ' + url_search);
    $scope.search.working = true;
    
    $http.get(url_search).
        success(function(response){
        $scope.data = angular.fromJson(response);
        //$scope.emails = getEmailList(response);       
        $scope.search.working = false;
        }
    );     
  };
  
  $scope.searchWithout = function () {
    
    $log.info('competence not search',$scope.competence);
    
    var url_search = 'http://'+$scope.url+'/benevoles/competences/'+$scope.competence+'/no?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
    $log.info('URI: ' + url_search);
    $scope.search.working = true;
    
    $http.get(url_search).
        success(function(response){
        $scope.data = angular.fromJson(response);    
        $scope.search.working = false;
        }
    )};   
    
    
    $scope.searchComplexe = function () {
    
        var url_search = 'http://'+$scope.url+'/benevoles/competences/'+$scope.competence+'/no/'+$scope.competence2+'/yes?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
        $log.info('URI: ' + url_search);
        $scope.search.working = true;
        
        $http.get(url_search).
            success(function(response){
            $scope.data = angular.fromJson(response);   
            $scope.search.working = false;
            }
    )};     
    
    
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
