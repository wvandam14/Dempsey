// directive handles the color picker based on image upload
soccerStats.directive('colorPicker', function ($timeout, toastService, configService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/color-picker.html",
        scope: {
            color: '='
        },
        link: function ($scope, element, attr) {
            var input = $(element).find('input').first();

        },
        controller:function($scope){
            // Regular expressions to match the color string
            $scope.keywordsRegex = /^[a-z]*$/;
            $scope.hexRegex = /^#[0-9a-f]{3}([0-9a-f]{3})?$/;
            $scope.rgbRegex = /^rgb\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*\)$/;
            $scope.rgbaRegex = /^rgba\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*((0.[1-9])|[01])\s*\)$/;
            $scope.hslRegex = /^hsl\(\s*(0|[1-9]\d?|[12]\d\d|3[0-5]\d)\s*,\s*((0|[1-9]\d?|100)%)\s*,\s*((0|[1-9]\d?|100)%)\s*\)$/;
        }
    };
});
