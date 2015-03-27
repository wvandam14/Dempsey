soccerStats.factory('configService', function () {
    return {

        messages: {

        }, toasts: {
            general: function(action, type, success){
                switch(action){
                    case 'a':  //add
                        action = success ? 'saved' : 'saving'
                        break;
                    case 'u':  //update
                        action = success ? 'updated' : 'updating'
                        break;
                    case 'r':  //remove
                        action = success ? 'removed' : 'removing'
                        break;
                    default:throw{msg:'that action is not supported', action:action, code:'T1'};
                }
                if(success){
                    //uppercase
                    return type.charAt(0).toUpperCase() + type.slice(1) + ' ' + action + ' successfully.'

                }else{
                    return 'There was an error ' + action + ' this ' + type + '.  Please try again.'
                }
            }, loginSuccess: function (name) {
                return 'Welcome ' + name + '!';
            }, changedPassword : function(success){
                return success ? 'Password successfully changed.' : 'There was an error updating your password. Please try again.'
            }
            , requiredFields : 'Please fill out the required fields.'
            , registrationSuccess : 'Registration successful!'
            , emailValidation : 'Please enter a valid email address.'
            , notAuthenticated: 'You could not be authenticated. Please login again.'
            , cannotConnectToServer: 'The server could not be contacted.  Please check your connection and try again.'
            , savingInProgress: 'Saving is already in progress'
        }
    }
});