soccerStats.controller('shellController',
    function shellController($scope, $rootScope, deviceDetector) {

        // Mobile Detectors
        $rootScope.isDesktop = deviceDetector.isDesktop();
        $rootScope.isMobile = navigator.userAgent.match(/Android|iPhone|iPod/i);
        $rootScope.isTablet = navigator.userAgent.match(/iPad/i);

    });