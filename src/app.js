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
  'angular-login.register',
  'angular-login.error',
  'angular-services.competence',
  'angular-services.googleconnect',
  'angular-login.google',
  'angular-services.emails',
  // components
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap',
  'ngTable'
])
  .config(function ($urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $httpProvider.defaults.useXDomain = true;
    //X-Requested-With delete automatically insert with angularJS 1.3
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    //$locationProvider.html5Mode(true);
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
  .controller('BodyController', function ($scope, $state, $stateParams, loginService, $http, $timeout, $log, GoogleConnectFactory, $window) {
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
        var url_connect = 'http://' + $scope.url + '/connect';
        var testHeaders = {
          method: 'GET',
          url: url_connect,
          headers: {
            'username': $scope.login.username,
            'password': $scope.login.password
          }
        };
        //$log.info(testHeaders);
        
        var loginPromise = $http(testHeaders, $scope.login);

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
        var url_connect = 'http://' + $scope.url + '/connecttest';
        //$log.info(url_connect);
        var req = {
          method: 'GET',
          url: url_connect,
          headers: {
            'F5-ST': $scope.ls.F5_ST,
            'LastMRH-Session': $scope.ls.LastMRH_Session,
            'MRHSession': $scope.ls.MRHSession,
            'SAML': $scope.ls.SAML,
            'JSESSIONID': $scope.ls.JSESSIONID
          }
        };

        var loginPromise = $http(req, $scope.login);

        $scope.login.working = true;
        $scope.login.wrong = false;

        loginService.loginUser(loginPromise);
        loginPromise.error(function () {
          $scope.login.wrong = true;
          $timeout(function () { $scope.login.wrong = false; }, 8000);
          loginService.logoutUser($http.get('/'));
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
      return GoogleConnectFactory.isAuthenticated();
    };

    $scope.googleMe = function () {      
      $scope.logingoogle.working = true;
      GoogleConnectFactory.login().then(function (response){
          $log.info(response);
          $scope.logingoogle.working = false;
        },function (response){
          $window.alert(response.data.message);
          $scope.logingoogle.working = false;
        });
    };

    $scope.googleOutMe = function () {
     	GoogleConnectFactory.logout();
    };

    $scope.isTeamFormat = function () {
      return loginService.isInTeamFormat;
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
