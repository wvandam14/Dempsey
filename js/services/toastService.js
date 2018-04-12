// service for handing general toast messages and broadcasting
soccerStats.factory('toastService', function ($rootScope, configService) {

    var
        loading = function(message, success) {
            $rootScope.$broadcast(configService.messages.toast, {message: message}, 'loading', success);
        }
        ,info = function(message) {
            $rootScope.$broadcast(configService.messages.toast, {message: message}, 'info');
        }
        , error = function(message) {
            $rootScope.$broadcast(configService.messages.toast, {message: message}, 'error');
        }
        , success = function(message) {
            $rootScope.$broadcast(configService.messages.toast, {message: message}, 'success');
        };


    return {
        info: info,
        error: error,
        success: success
    }
});