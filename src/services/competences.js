angular.module('angular-services.competence', [])
    .service('datalib', function ($http, $log, loginService) {

        var hashComp = {};
        hashComp['166'] = "PSE1";
        hashComp['167'] = "PSE2";
        hashComp['116'] = "CIP2";
        hashComp['47'] = "OPR";
        hashComp['113'] = "FIPS";
        hashComp['224'] = "FIPSEN";
        hashComp['288'] = "FPS";
        hashComp['286'] = "FPSC";
        hashComp['284'] = "PICF";
        hashComp['25'] = "FCI";
        hashComp['292'] = "FFPS";
        hashComp['294'] = "FFPSC";
        hashComp['43'] = "MORAD";
        hashComp['143'] = "FIAPS";


        var hashRole = {};
        hashRole['9'] = "Conducteur VL";
        hashRole['10'] = "Conducteur VPSP";
        hashRole['11'] = "Evaluateur Chauffeur";
        hashRole['34'] = "Elu local";
        hashRole['35'] = "Elu departemental";
        hashRole['15'] = "Maraudeur";
        hashRole['18'] = "Régulateur";
        hashRole['44'] = "Régulateur terrain";
        hashRole['32'] = "TSA";
        hashRole['75'] = "CI";
        hashRole['254'] = "CIR";
        hashRole['255'] = "CI BSPP";

        this.getHashComp = function () {
            return hashComp;
        }

        this.getHashRole = function () {
            // var url_search = 'http://' + url_ws_pegass + '/benevoles/roles?F5_ST=' + loginService.user.F5_ST + '&LastMRH_Session=' + loginService.user.LastMRH_Session + '&MRHSession=' + loginService.user.MRHSession;
            // $log.info('URI: ' + url_search);
            
            // $http.get(url_search).
            //     success(function (response) {
            //         $log.info(response);
            //     });


            return hashRole;
        }
    });
