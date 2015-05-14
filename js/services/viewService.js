// service for handling the opening and closing of modals and validating forms
soccerStats.factory('viewService', function ($location, $timeout, $rootScope, configService) {

    var
        goToPage = function(path) {
            $timeout(function() {
                $location.path(path);
            });
        }

        // closing modals
        , closeModal = function (modal) {
            $rootScope.$broadcast(configService.messages.closeModal, { modal : modal});
        }

        // opening modals
        , openModal = function (modal, state) {
            $rootScope.$broadcast(configService.messages.openModal, { modal: modal, state: state});
        }

        , validateAreaByFormName = function (form) {    // form validation
            // Find all the required fields
            var isValid = true;
            _.each($('form[name=' + form + '] input, form[name=' + form + '] select'), function (field) {
                if ($(field).is('[required]')) {

                    // Simulate the blur on the
                    $(field).addClass('ng-touched');

                    // Is there a value? set to ng-valid
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
        closeModal: closeModal,
        openModal: openModal,
        validateAreaByFormName: validateAreaByFormName
    }

});