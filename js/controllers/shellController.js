soccerStats.controller('shellController',
    function shellController($scope, $rootScope, $timeout, configService, deviceDetector, viewService,
        toastService, configService) {

        // Global device flags: Can be used in any html as an attribute like so: ng-show="$root.isMobile"
        $rootScope.isDesktop = deviceDetector.isDesktop();
        $rootScope.isMobile = navigator.userAgent.match(/Android|iPhone|iPod/i);
        $rootScope.isTablet = navigator.userAgent.match(/iPad/i);

        // Toast Functions
        $scope.toasts = [];

        $scope.$on(configService.messages.toast, function (event, message, type, callback) {
            showToast(message.message, type, callback);
        })

        var showToast = function (message, type, callback) {
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

            if (callback) {
                callback = $scope.closeToast(item);
                return;
            }

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

        $scope.logout = function () {
            var currentUser = Parse.User.current();
            console.log(currentUser.get("username"));
            Parse.User.logOut();
            currentUser = Parse.User.current();
            console.log(currentUser);
            toastService.success(configService.toasts.logoutSuccess);
            viewService.goToPage('/login');

        };

    });