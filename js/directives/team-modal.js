soccerStats.directive('teamModal', function (viewService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/team-modal.html",
        controller: function($scope){
            var self = 'teamModal';

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }
        }
    };
});