// directive handles the bench formation
soccerStats.directive('benchFormation', function () {
    return {
        restrict: 'E',
        templateUrl: './templates/directives/bench-formation.html',
        scope: {
            formation: '=',
            selectPlayer: '&',
            isSelected: '&'
        },
        link: function(scope, elem, attrs) {
            scope.init(elem);
        },
        controller: function($scope) {
            $scope.init = function(elem) {
            }
        }
    };
});
