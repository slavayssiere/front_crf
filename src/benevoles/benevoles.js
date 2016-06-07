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
      
    var url_search = 'http://'+$scope.url+'/benevoles?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
    $log.info('URI: ' + url_search);
    
    var getEmail = function(data) {
        var emailList = [];
        
        angular.forEach(data.list, function(key, value) {
            if(key == "email") {
                emailList.push(value + '; ');
            }
        })
        return emailList;
    }
    
    $http.get(url_search).
        success(function(response){
        $scope.data = angular.fromJson(response);
        $scope.email = getEmail(response);        
        }
    );     

  
});
