soccerStats.directive('doughnutChart', function () {
    return {
        restrict: 'E',
        templateUrl: './templates/directives/doughnut-chart.html',
        scope: {
            data: '=',
            num: '=?',
            label: '=?'
        },
        link: function(scope, elem, attrs) {
            scope.init(elem);
        },
        controller: function($scope){

            var options = {
                segmentShowStroke : false,
                percentageInnerCutout : 70, // This is 0 for Pie charts
                animation: false,
                maintainAspectRatio: true,
                responsive: false
            };

            $scope.init = function(elem) {
               var element = angular.element(elem);
               var chart = element.find('canvas')[0].getContext("2d");
                // And for a doughnut chart
               var myDoughnutChart = new Chart(chart).Doughnut($scope.data,options);
            }


        }
    };
});
