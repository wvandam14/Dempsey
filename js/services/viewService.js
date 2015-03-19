soccerStats.factory('viewService', function ($location) {

    var
        goToPage = function(path) {
            $location.path(path);
        },

        validateAreaByFormName = function (form) {
            //find all the required fields
            var isValid = true;
            _.each($('form[name=' + form + '] input'), function (field) {
                if ($(field).is('[required]')) {
                    //set it to dirty
                    $(field).addClass('ng-touched');
                    //is there a value? set to ng-valid
                    if (!field.value || (field.className.indexOf('ng-invalid-email') != -1)) {
                        isValid = false;
                        $(field).addClass('ng-invalid');
                        $(field).addClass('ng-invalid-required');
                    }
                    else {
                        $(field).addClass('ng-valid');
                        $(field).addClass('ng-valid-required');
                    }

                }
            });

            return isValid;
        };

    return {
        goToPage: goToPage,
        validateAreaByFormName: validateAreaByFormName
    }

});