angular.module('angular-services.googleconnect', ['satellizer'])
    .config(function ($authProvider){
        $authProvider.google({
        url: 'http://' + url_ws_google + '/api/auth/google',
        scope: [
            'profile',
            'email',
            'https://mail.google.com/',
            'https://www.googleapis.com/auth/gmail.compose',
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
    .factory('GoogleConnectFactory', function ($auth, $q, $log) {
        var google = {            
            token: false,
            refreshToken: false,
            expiresInSeconds: false,
            isAuthenticated: function () {
                return $auth.isAuthenticated();
            },
            login: function (){
                var deferred = $q.defer();
                $auth.authenticate('google')
                    .then(function (response) {
                        $auth.setToken(response.data.token);
                        google.token = response.data.token;
                        google.refreshToken = response.data.refreshToken;
                        google.expiresInSeconds = response.data.expiresInSeconds;
                        deferred.resolve();
                    })
                    .catch(function (response) {
                        $log.info(response);
                        deferred.reject(response);
                    })                
                return deferred.promise; 
            },
            logout: function(){
                $auth.logout();
            }
        }

        return google;
    });