soccerStats.controller('shellController',
    function shellController($scope, $rootScope, $timeout, configService, deviceDetector) {

        // Global device flags: Can be used in any html as an attribute like so: ng-show="$root.isMobile"
        $rootScope.isDesktop = deviceDetector.isDesktop();
        $rootScope.isMobile = navigator.userAgent.match(/Android|iPhone|iPod/i);
        $rootScope.isTablet = navigator.userAgent.match(/iPad/i);

        // Toast Functions
        $scope.toasts = [];

        $scope.$on(configService.messages.toast, function (event, message, type) {
            showToast(message.message, type);
        })

        var showToast = function (message, type) {
            // New Toast Item
            var item = {
                message: message,
                error: type === 'error',
                success: type === 'success',
                slideIn: true,
                slideOut: false
            };

            $timeout(function () {
                $scope.toasts.push(item);
            });

            $timeout(function () {
                $scope.closeToast(item);
            }, 5000);
        };

        $scope.closeToast = function (item) {
            if ($scope.toasts.indexOf(item) == -1) {
                return;
            }

            // Wait for animation to finish before removing toast
            item.slideOut = true;
            $timeout(function () {
                // do closing animation
                $scope.toasts.splice($scope.toasts.indexOf(item), 1);
            },1000);
        }

    });