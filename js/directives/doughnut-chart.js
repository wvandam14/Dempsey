// directive for handling the doughnut chart information
soccerStats.directive('doughnutChart', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: './templates/directives/doughnut-chart.html',
        scope: {
            data: '=',
            num: '=?',
            label: '=?',
            large: '=?'
        },
        link: function(scope, elem, attrs) {
            scope.init(elem);
        },
        controller: function($scope){
            var thisElement;

            if (!$scope.large) $scope.large = false;

            var options = {
                segmentShowStroke : true,
                percentageInnerCutout : 70, // This is 0 for Pie charts
                animation: false,
                maintainAspectRatio: true,
                responsive: false
            };

            $scope.init = function(elem) {
                $timeout(function() {

                   thisElement = elem;
                   var element = angular.element(elem);
                   var chart = element.find('canvas')[0].getContext("2d");

                    if ($scope.large) {
                        chart.canvas.width = 275;
                        chart.canvas.height = 275;
                    }
                    // And for a doughnut chart
                   var myDoughnutChart = new Chart(chart).Doughnut($scope.data, options);
                });
            }

            $scope.$watch('data', function(val) {
                $timeout(function() {
                    $scope.init(thisElement);
                });
            })


        }
    };
});
