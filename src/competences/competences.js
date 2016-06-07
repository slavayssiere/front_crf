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
  
  
    var getEmailList = function(data) {
        var emailList = "";
        $log.info(data.list);
        for (i = 0; i < data.list.length; i++) {
            $log.info(data.list[i]);
            emailList += data.list[i].email + "; ";
        }
        return emailList;
    }
  
  $scope.search = function () {
    
    $log.info('competence search',$scope.competence);
    
    var url_search = 'http://'+$scope.url+'/benevoles/com/'+$scope.competence+'?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
    $log.info('URI: ' + url_search);
    $scope.search.working = true;
    
    $http.get(url_search).
        success(function(response){
        $scope.data = angular.fromJson(response);
        $scope.emails = getEmailList(response);       
        $scope.search.working = false;
        }
    );     
  };
  
  $scope.searchWithout = function () {
    
    $log.info('competence not search',$scope.competence);
    
    var url_search = 'http://'+$scope.url+'/benevoles/com/without/'+$scope.competence+'?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
    $log.info('URI: ' + url_search);
    $scope.search.working = true;
    
    $http.get(url_search).
        success(function(response){
        $scope.data = angular.fromJson(response);
        $scope.emails = getEmailList(response);        
        $scope.search.working = false;
        }
    )};   
    
    
    $scope.searchComplexe = function () {
    
        var url_search = 'http://'+$scope.url+'/benevoles/com/without/'+$scope.competence+'/with/'+$scope.competence2+'?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
        $log.info('URI: ' + url_search);
        $scope.search.working = true;
        
        $http.get(url_search).
            success(function(response){
            $scope.data = angular.fromJson(response);
            $scope.emails = getEmailList(response);       
            $scope.search.working = false;
            }
    )};     
    
    
  
});
