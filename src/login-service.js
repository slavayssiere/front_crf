angular.module('loginService', ['ui.router'])
.provider('loginService', function () {
  var userToken = localStorage.getItem('userToken'),
      errorState = 'app.error',
      logoutState = 'app.home';

  var F5_ST = localStorage.getItem('F5_ST');
  var LastMRH_Session = localStorage.getItem('LastMRH_Session');
  var MRHSession = localStorage.getItem('MRHSession');
  
  this.$get = function ($rootScope, $http, $q, $state, $log) {

    /**
     * Low-level, private functions.
     */
    var setHeaders = function (token) {
      if (!token) {
        delete $http.defaults.headers.common['X-Token'];
        return;
      }
      $http.defaults.headers.common['X-Token'] = token.toString();
    };

    var setTokens = function (F5_ST, LastMRH_Session, MRHSession) {
      if (!F5_ST && !LastMRH_Session && !MRHSession) {
        localStorage.removeItem('F5_ST');
        localStorage.removeItem('LastMRH_Session');
        localStorage.removeItem('MRHSession');
      } else {
        localStorage.setItem('F5_ST', F5_ST);
        localStorage.setItem('LastMRH_Session', LastMRH_Session);
        localStorage.setItem('MRHSession', MRHSession);
      }      
    };
    
    var getTokens = function () {
        
        F5_ST = localStorage.getItem('F5_ST');
        LastMRH_Session = localStorage.getItem('LastMRH_Session');
        MRHSession = localStorage.getItem('MRHSession');
        
        if(!F5_ST && !LastMRH_Session && !MRHSession){
          $log.info("no data");
          return false;
        }
        else{
          $log.info("data");
          return true;
        }
    };

    var getLoginData = function () {
      if (!getTokens()) {
        $log.info('we have not localstorage data');
        wrappedService.userRole = userRoles.public;
        wrappedService.isLogged = false;
        wrappedService.doneLoading = true;
      }
      else {
        $log.info('we have localstorage data');
        var url_connect = 'http://'+url_ws_pegass+'/connecttest?F5_ST='+F5_ST+'&LastMRH_Session='+LastMRH_Session+'&MRHSession='+MRHSession;        
        $log.info(url_connect);
        var loginPromise = $http.get(url_connect);
        
        wrappedService.loginUser(loginPromise);
        
        loginPromise.error(function () {
            $log.info("401");
            wrappedService.userRole = userRoles.public;
            wrappedService.isLogged = false;
            wrappedService.doneLoading = true;
        });
        
        wrappedService.isLogged = true;
        wrappedService.doneLoading = true;
      }
    };

    var managePermissions = function () {
      // Register routing function.
      $rootScope.$on('$stateChangeStart', function (event, to, toParams, from, fromParams) {
        $log.info("change start");
        /**
         * $stateChangeStart is a synchronous check to the accessLevels property
         * if it's not set, it will setup a pendingStateChange and will let
         * the grandfather resolve do his job.
         *
         * In short:
         * If accessLevels is still undefined, it let the user change the state.
         * Grandfather.resolve will either let the user in or reject the promise later!
         */
        if (wrappedService.userRole === null) {
           $log.info("user role null");
          wrappedService.doneLoading = false;
          wrappedService.pendingStateChange = {
            to: to,
            toParams: toParams
          };
          return;
        }

        // if the state has undefined accessLevel, anyone can access it.
        // NOTE: if `wrappedService.userRole === undefined` means the service still doesn't know the user role,
        // we need to rely on grandfather resolve, so we let the stateChange success, for now.
        if (to.accessLevel === undefined || to.accessLevel.bitMask & wrappedService.userRole.bitMask) {
          $log.info("case 1");
          angular.noop(); // requested state can be transitioned to.
        } else {
          $log.info("case 2");
          event.preventDefault();
          $rootScope.$emit('$statePermissionError');
          $state.go(errorState, { error: 'unauthorized' }, { location: false, inherit: false });
        }
      });

      /**
       * Gets triggered when a resolve isn't fulfilled
       * NOTE: when the user doesn't have required permissions for a state, this event
       *       it's not triggered.
       *
       * In order to redirect to the desired state, the $http status code gets parsed.
       * If it's an HTTP code (ex: 403), could be prefixed with a string (ex: resolvename403),
       * to handle same status codes for different resolve(s).
       * This is defined inside $state.redirectMap.
       */
      $rootScope.$on('$stateChangeError', function (event, to, toParams, from, fromParams, error) {
        /**
         * This is a very clever way to implement failure redirection.
         * You can use the value of redirectMap, based on the value of the rejection
         * So you can setup DIFFERENT redirections based on different promise errors.
         */
        var errorObj, redirectObj;
        // in case the promise given to resolve function is an $http request
        // the error is a object containing the error and additional informations
        error = (typeof error === 'object') ? error.status.toString() : error;
        // in case of a random 4xx/5xx status code from server, user gets loggedout
        // otherwise it *might* forever loop (look call diagram)
        if (/^[45]\d{2}$/.test(error)) {
          wrappedService.logoutUser();
        }
        /**
         * Generic redirect handling.
         * If a state transition has been prevented and it's not one of the 2 above errors, means it's a
         * custom error in your application.
         *
         * redirectMap should be defined in the $state(s) that can generate transition errors.
         */
        if (angular.isDefined(to.redirectMap) && angular.isDefined(to.redirectMap[error])) {
          if (typeof to.redirectMap[error] === 'string') {
            return $state.go(to.redirectMap[error], { error: error }, { location: false, inherit: false });
          } else if (typeof to.redirectMap[error] === 'object') {
            redirectObj = to.redirectMap[error];
            return $state.go(redirectObj.state, { error: redirectObj.prefix + error }, { location: false, inherit: false });
          }
        }
        return $state.go(errorState, { error: error }, { location: false, inherit: false });
      });
    };

    /**
     * High level, public methods
     */
    var wrappedService = {
      loginHandler: function (user, status, headers, config) {
        /**
         * Custom logic to manually set userRole goes here
         *
         * Commented example shows an userObj coming with a 'completed'
         * property defining if the user has completed his registration process,
         * validating his/her email or not.
         *
         * EXAMPLE:
         * if (user.hasValidatedEmail) {
         *   wrappedService.userRole = userRoles.registered;
         * } else {
         *   wrappedService.userRole = userRoles.invalidEmail;
         *   $state.go('app.nagscreen');
         * }
         */
        $log.info('user', user);
        
        // setup token
        setTokens(user.F5_ST, user.LastMRH_Session, user.MRHSession);
        // update user
        angular.extend(wrappedService.user, user);
        // flag true on isLogged
        wrappedService.isLogged = true;
        // update userRole
        var url_search = 'http://'+url_ws_pegass+'/benevoles/nominations/'+user.utilisateur.id+'?F5_ST='+user.F5_ST+'&LastMRH_Session='+user.LastMRH_Session+'&MRHSession='+user.MRHSession;
        $log.info('URI: ' + url_search);
        
        $http.get(url_search).
            success(function(response){
              nominations = angular.fromJson(response);
              for (i = 0; i < nominations.length; i++) {
                $log.info(nominations[i].libelleCourt);
                if(nominations[i].libelleCourt == "DLUS.A.FOR"){
                  $log.info("Tu es DLAF!");
                  wrappedService.userRole=userRoles.dlaf;
                }
                
                if(nominations[i].libelleCourt == "CS FORM"){
                  wrappedService.userRole=userRoles.ddaf;
                }
                
                if(nominations[i].libelleCourt == "DLUS"){
                  wrappedService.userRole=userRoles.dlus;
                }
                
                if(user.utilisateur.id == "00001376977M") {
                  wrappedService.userRole=userRoles.admin;
                }
                
                if(user.utilisateur.id == "00000040109X") {
                  wrappedService.userRole=userRoles.ddaf;
                }
              }
            }
        );
        return user;
      },
      loginUser: function (httpPromise) {
        httpPromise.success(this.loginHandler);
      },
      logoutUser: function (httpPromise) {
        /**
         * De-registers the userToken remotely
         * then clears the loginService as it was on startup
         */
        setTokens(null, null, null);
        this.userRole = userRoles.public;
        this.user = {};
        this.isLogged = false;
        $state.go(logoutState);
      },
      resolvePendingState: function (httpPromise) {
        var checkUser = $q.defer(),
            self = this,
            pendingState = self.pendingStateChange;

        // When the $http is done, we register the http result into loginHandler, `data` parameter goes into loginService.loginHandler
        httpPromise.success(self.loginHandler);

        httpPromise.then(
          function success(httpObj) {
            self.doneLoading = true;
            // duplicated logic from $stateChangeStart, slightly different, now we surely have the userRole informations.
            if (pendingState.to.accessLevel === undefined || pendingState.to.accessLevel.bitMask & self.userRole.bitMask) {
              checkUser.resolve();
            } else {
              checkUser.reject('unauthorized');
            }
          },
          function reject(httpObj) {
            checkUser.reject(httpObj.status.toString());
          }
        );
        /**
         * I setted up the state change inside the promises success/error,
         * so i can safely assign pendingStateChange back to null.
         */
        self.pendingStateChange = null;
        return checkUser.promise;
      },
      /**
       * Public properties
       */
      userRole: null,
      user: {},
      isLogged: null,
      pendingStateChange: null,
      doneLoading: null
    };

    $log.info('userroles', userRoles);
    getLoginData();
    managePermissions();

    return wrappedService;
  };
});
