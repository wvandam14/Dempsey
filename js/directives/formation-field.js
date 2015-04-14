soccerStats.directive('formationField', function () {
    return {
        restrict: 'E',
        templateUrl: './templates/directives/formation-field.html',
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
