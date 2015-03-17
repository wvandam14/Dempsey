soccerStats.controller('shellController',
    function shellController($scope, $rootScope, deviceDetector) {

        console.log(deviceDetector);

        // Mobile Detectors
        $rootScope.isDesktop = deviceDetector.isDesktop();
        $rootScope.isMobile = deviceDetector.isMobile();
        $rootScope.isTablet = deviceDetector.isTablet();

    });