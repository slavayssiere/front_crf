angular.module('angular-services.emails', [])
    .factory('BenevolesDataFactory', function (loginService, $log, $http, $q) {
        var benevoleData = {
            list: false,
            searchemail: function (listBenevoles) {
                var deferred = $q.defer();

                var url_search = 'http://' + url_ws_pegass + '/benevoles/emails?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession;
                $log.info('URI: ' + url_search);
                var req = {
                    method: 'POST',
                    url: url_search,
                    data: angular.toJson(listBenevoles)
                }

                $http(req).
                    success(function (response) {
                        benevoleData.list = angular.fromJson(response);
                        deferred.resolve(benevoleData.parseemails());
                    })
                    .error(function (res){
                        deferred.reject('No email return');
                    });

                return deferred.promise;                
            },
            parseemails: function () {
                var emailList = "";
                for (i = 0; i < benevoleData.list.list.length; i++) {
                    emailList += benevoleData.list.list[i].email + "; ";
                }
                return emailList;
            }
        }

        return benevoleData;
    });