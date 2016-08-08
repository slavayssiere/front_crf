angular.module('angular-login', [
  // login service
  'loginService',
  //'angular-login.mock',
  'angular-login.directives',
  // different app sections
  'angular-login.home',
  'angular-login.recyclage',
  'angular-login.stats',
  'angular-login.competences',
  'angular-login.pages',
  'angular-login.benevoles',
  'angular-login.benevolesadmin',
  'angular-login.register',
  'angular-login.error',
  'angular-services.competence',
  'angular-login.google',
  // components
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap',
  'ngTable',
  'satellizer'
])
  .config(function ($urlRouterProvider, $httpProvider, $locationProvider, $authProvider) {
    $urlRouterProvider.otherwise('/');
    $httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    //$locationProvider.html5Mode(true);
    $authProvider.google({
      url: 'http://' + url_ws_google + '/api/auth/google',
      scope: [
        'profile',
        'email',
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive.scripts',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/script.external_request'
      ], //https://www.googleapis.com/auth/userinfo.profile
      //clientId: '1037173200559-u3fibeuoidab32gl829ur4eoe2h147pi.apps.googleusercontent.com'
      clientId: '794502709562-bgo3mjvn9jhpifvd0no50vebts8j9050.apps.googleusercontent.com'
    });
  })
  .run(function ($rootScope, $window) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
      var realURL = toState.url;
      if (!!$window.ga) {
        // resolves variables inside urls, ex: /error/:error in /error/unauthorized
        for (var v in toParams) {
          realURL = realURL.replace(':' + v, toParams[v]);
        }
        $window.ga('send', 'pageview', realURL);
      }
    });
    /**
     * $rootScope.doingResolve is a flag useful to display a spinner on changing states.
     * Some states may require remote data so it will take awhile to load.
     */
    var resolveDone = function () { $rootScope.doingResolve = false; };
    $rootScope.doingResolve = false;

    $rootScope.$on('$stateChangeStart', function () {
      $rootScope.doingResolve = true;
    });
    $rootScope.$on('$stateChangeSuccess', resolveDone);
    $rootScope.$on('$stateChangeError', resolveDone);
    $rootScope.$on('$statePermissionError', resolveDone);
  })
  .controller('BodyController', function ($scope, $state, $stateParams, loginService, $http, $timeout, $log, $auth) {
    // Expose $state and $stateParams to the <body> tag
    $scope.$state = $state;
    $scope.$stateParams = $stateParams;
    $scope.url = url_ws_pegass;
    $scope.url_google = url_ws_google;

    // loginService exposed and a new Object containing login user/pwd
    $scope.ls = loginService;
    $scope.login = {
      working: false,
      wrong: false
    };

    $scope.logingoogle = {
      working: false
    }

    $scope.loginMe = function () {

      if ($scope.ls.inLocalStorage == false) {
        // setup promise, and 'working' flag
        var url_connect = 'http://' + $scope.url + '/connect?username=' + $scope.login.username + '&password=' + $scope.login.password;
        $log.info(url_connect);
        var loginPromise = $http.get(url_connect, $scope.login);

        $scope.login.working = true;
        $scope.login.wrong = false;

        loginService.loginUser(loginPromise);
        loginPromise.error(function () {
          $scope.login.wrong = true;
          loginService.logoutUser($http.get('/#/logout'));
          $timeout(function () { $scope.login.wrong = false; }, 8000);
        });
        loginPromise.finally(function () {
          $scope.login.working = false;
        });
      }
      else {
        var url_connect = 'http://' + $scope.url + '/connecttest?F5_ST=' + $scope.ls.F5_ST + '&LastMRH_Session=' + $scope.ls.LastMRH_Session + '&MRHSession=' + $scope.ls.MRHSession;
        $log.info(url_connect);
        var loginPromise = $http.get(url_connect, $scope.login);

        $scope.login.working = true;
        $scope.login.wrong = false;

        loginService.loginUser(loginPromise);
        loginPromise.error(function () {
          $scope.login.wrong = true;
          $timeout(function () { $scope.login.wrong = false; }, 8000);
          loginService.logoutUser($http.get('/#/logout'));
        });
        loginPromise.finally(function () {
          $scope.login.working = false;
        });
      }
    };

    $scope.logoutMe = function () {
      loginService.logoutUser($http.get('/#/logout'));
    };

    // Controller
    $scope.isAuthenticated = function () {
      return $auth.isAuthenticated();
    };

    $scope.googleMe = function () {
      $scope.logingoogle.working = true;
     	$auth.authenticate('google')
        .then(function (response) {
          $log.info("logged", $auth.isAuthenticated());
          $auth.setToken(response.data.token);
          loginService.gw_token = response.data.token;
          loginService.gw_refresh = response.data.refreshToken;
          loginService.gw_expire = response.data.expiresInSeconds;
        })
        .catch(function (response) {
          $log.info("error in login");
          $log.info(response);
        })
        .finally(function (response){
          $scope.logingoogle.working = false;
        });
    };

    $scope.googleOutMe = function () {
     	$auth.logout();
    };

    $scope.isTeamFormat = function () {
      var members = ['00001376977M', '00001669247X', '00001727030F', '00001701729E', '00001641554W', '00000599352T'] //me: '00001376977M'
      if(loginService.user.utilisateur){
        return (members.indexOf(loginService.user.utilisateur.id) > -1)
      }
      else {
        return false;
      } 
    }


    if ($scope.ls.inLocalStorage == true) {
      $scope.loginMe();
    }

    var url_version_pegass = 'http://' + $scope.url + '/version'
    $http.get(url_version_pegass).
      success(function (response) {
        $scope.version_pegass = response.version;
      });
    
    var url_version_google = 'http://' + $scope.url_google + '/info'
    $http.get(url_version_google).
      success(function (response) {
        $scope.version_google = response.app.version;
      });  
    
  });
