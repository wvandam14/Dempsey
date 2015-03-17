soccerStats.factory('viewService', function ($rootScope) {

    var

    validateAreaByFormName = function (form) {
        //find all the required fields
        var isValid = true;
        _.each($('form[name=' + form + '] input'), function (field) {
            if ($(field).is('[required]')) {
                //set it to dirty
                $(field).addClass('ng-touched');
                //is there a value? set to ng-valid
                if (!field.value) {
                    isValid = false;
                    $(field).addClass('ng-invalid');
                    $(field).addClass('ng-invalid-required');
                }
                else {
                    $(field).addClass('ng-valid');
                    $(field).addClass('ng-valid-required');
                }

            }
        })

        return isValid;
    };

    return {
        validateAreaByFormName: validateAreaByFormName
    }

});