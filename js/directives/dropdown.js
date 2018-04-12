// directive to handle the actions of the dropdown menu
soccerStats.directive('colorPicker', function ($timeout, toastService, configService) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: "./templates/directives/dropdown.html",
        scope: {
        },
        link: function ($scope, element, attr, dropdownCtrl) {
            dropdownCtrl.init( element );

        },
        controller: function($scope, $attrs, dropdownConfig, dropdownService, $animate) {
            var self = this, openClass = dropdownConfig.openClass;

            this.init = function( element ) {
                self.$element = element;
                $scope.isOpen = angular.isDefined($attrs.isOpen) ? $scope.$parent.$eval($attrs.isOpen) : false;
            };

            this.toggle = function( open ) {
                return $scope.isOpen = arguments.length ? !!open : !$scope.isOpen;
            };

            // Allow other directives to watch status
            this.isOpen = function() {
                return $scope.isOpen;
            };

            $scope.$watch('isOpen', function( value ) {
                $animate[value ? 'addClass' : 'removeClass'](self.$element, openClass);

                if ( value ) {
                    dropdownService.open( $scope );
                } else {
                    dropdownService.close( $scope );
                }

                $scope.onToggle({ open: !!value });
            });

            $scope.$on('$locationChangeSuccess', function() {
                $scope.isOpen = false;
            });
        }
    };
});
