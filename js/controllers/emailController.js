soccerStats.controller('emailController', 
    function emailController($scope, $location, toastService, configService, $timeout, viewService) {

        $scope.goToPage = function(path) {
            //$timeout(function() {
                viewService.goToPage(path);
            //});
        }
    	
    });
