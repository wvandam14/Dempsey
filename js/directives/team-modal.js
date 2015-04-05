soccerStats.directive('teamModal', function () {
    return {
        restrict: 'E',
        require: "header",
        templateUrl: "./templates/directives/team-modal.html",
        controller: function($scope){
            this.blah = function() {
                alert('teamModal');
            };
        },

    };
});
