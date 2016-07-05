angular.module('angular-services.competence', [])
    .service('datalib', function () {

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

        this.getHash = function () {
            return hashComp;
        }

        function parseemails(data) {
            var emailList = "";
            for (i = 0; i < data.list.length; i++) {
                emailList += data.list[i].email + "; ";
            }
            return emailList;
        }
        
        this.getEmailList = parseemails;
        
    });
