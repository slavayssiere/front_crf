angular.module('angular-login.stats', ['angular-login.grandfather'])
.config(function ($stateProvider) {
  $stateProvider
    .state('app.stats', {
      url: '/stats',
      templateUrl: 'stats/stats.tpl.html',
      controller: 'StatsController',
      accessLevel: accessLevels.dlaf
    })
})
.controller('StatsController', function ($scope, loginService, $http, $log) {
    var url_search = 'http://'+$scope.url+'/stats/formations?F5_ST='+loginService.user.F5_ST+'&LastMRH_Session='+loginService.user.LastMRH_Session+'&MRHSession='+loginService.user.MRHSession+'&ul='+loginService.user.utilisateur.structure.id;
    $log.info('URI: ' + url_search);

    $http.get(url_search).
        success(function(response){
        $scope.data = angular.fromJson(response);
        }
    );         
});

