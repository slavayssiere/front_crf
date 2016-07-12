angular.module('angular-login.stats', ['angular-login.grandfather'])
.config(function ($stateProvider) {
  $stateProvider
    .state('app.stats', {
      url: '/stats',
      templateUrl: 'stats/stats.tpl.html',
      controller: 'StatsController',
      accessLevel: accessLevels.dlaf
    })
    .state('app.statsmaraude', {
      url: '/statsmaraude',
      templateUrl: 'stats/statsmaraude.tpl.html',
      controller: 'StatsMaraudeController',
      accessLevel: accessLevels.public
    })
    .state('app.statsfc', {
      url: '/statsfc',
      templateUrl: 'stats/statsfc.tpl.html',
      controller: 'StatsFCController',
      accessLevel: accessLevels.dlaf
    })
})
.controller('StatsController', function ($scope, loginService, $http, $log) {
    $scope.year=2016;
    
    $scope.getData = function() {
        var url_search = 'http://'+$scope.url+'/stats/formations?year='+$scope.year+'&F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
        $log.info('URI: ' + url_search);

        $http.get(url_search).
            success(function(response){
            $scope.data = angular.fromJson(response);
            }
        );
    };
    
    $scope.getData();
})
.controller('StatsMaraudeController', function ($scope, loginService, $http, $log) {
    $scope.year=2016;
    
    $scope.getData = function() {
        var url_search = 'http://'+$scope.url+'/stats/maraude?year='+$scope.year+'&F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
        $log.info('URI: ' + url_search);

        $http.get(url_search).
            success(function(response){
            $scope.data = angular.fromJson(response);
            });
    };
    
    $scope.getData();         
})
.controller('StatsFCController', function ($scope, loginService, $http, $log) {
    $scope.year=2016;
    
    $scope.getData = function() {
        var url_search = 'http://'+$scope.url+'/stats/fc?year='+$scope.year+'&F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
        $log.info('URI: ' + url_search);

        $http.get(url_search).
            success(function(response){
            $scope.data = angular.fromJson(response);
            });  
    };
    
    $scope.getData();       
});

