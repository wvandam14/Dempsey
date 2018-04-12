// controller that wraps around all other controllers and in charge of handing page history and broadcasting messages
soccerStats.controller('shellController',
    function shellController($scope, $rootScope, $location, $route, $timeout, configService, deviceDetector, viewService, toastService, dataService) {

        // Global device flags: Can be used in any html as an attribute like so: ng-show="$root.isMobile"
        $rootScope.isDesktop = deviceDetector.isDesktop();
        $rootScope.isMobile = navigator.userAgent.match(/Android|iPhone|iPod/i);
        $rootScope.isTablet = navigator.userAgent.match(/iPad/i);

        // -------------  Functions ------------- \\
        var history = [];
        $scope.currentPage = 'login';
        $scope.currentUser = {};

        // if a user changes their page location
        $scope.$on('$locationChangeSuccess', function (next, current) {
          $timeout(function() {
               // check if user is logged in if accessing most pages

               if ($scope.currentPage != 'login' && $scope.currentPage != 'registration' && $scope.currentPage != 'verify-email' && $scope.currentPage != 'password-reset-success' && $scope.currentPage != 'password-reset'){
                   if (Parse.User.current()){
                       console.log("user logged in");
                        //$timeout(function() {
                             //$rootScope.$broadcast(configService.messages.teamChanged, {team: dataService.getCurrentTeam()});
                        //});
                       
                   }
                   else {
                       viewService.goToPage('/login');
                       $scope.currentUser = {};
                   }
               }
               else{
                    if (Parse.User.current()){
                        viewService.goToPage('/home');
                   }
               }

                /*dataService.getTeams( function(_teams) {
                    dataService.setCurrentTeam(_teams[0]);
                     $timeout(function() {
                       $rootScope.$broadcast(configService.messages.teamChanged, {team: _teams[0]});
                    });
                    //console.log(dataService.getCurrentTeam());
                });
*/
                history.push({url: current.split('#')[1], state: {}});
                $scope.currentPage = current.split('#')[1] ? current.split('#')[1].split('/')[1] : '';
                //console.log($scope.currentPage);
                $scope.currentPage = $scope.currentPage.split('?')[0] ? $scope.currentPage.split('?')[0] : '';
                $rootScope.$broadcast(configService.messages.navigate, history[history.length - 1].url);

            });
        });

         // redirect to another page
         $scope.goToPage = function(page) {
             viewService.goToPage(page);
         }

        // view the home page
         $scope.viewHomePage = function(page) {
            //$scope.homeClicked = true;
            $scope.goToPage(page);
            $timeout(function() {
                $rootScope.$broadcast(configService.messages.teamChanged, {team: dataService.getCurrentTeam()});
            });
            
         }

        // logout
        $scope.logout = function () {
            Parse.User.logOut();
            toastService.success(configService.toasts.logoutSuccess);
            viewService.goToPage('/login');
        };

        // ------------- END Main Functions ------------- \\


        // ------------- Toast Functions ------------- \\
        $scope.toasts = [];

        $scope.$on(configService.messages.toast, function (event, message, type, callback) {
            showToast(message.message, type, callback);
        })

        // $scope.$on(configService.messages.homeClicked, function (event, msg) {
        //     $scope.homeClicked = true;
        // })

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

        // ------------- END Toast Functions ------------- \\

        // ------------- Modal Functions ------------- \\
        $scope.currentModal = '';
        
        // Message received when client wants to close a modal
        $scope.$on(configService.messages.closeModal, function(msg, data) {
            if (data.modal) {
                $timeout(function() {
                    $scope.currentModal = '';
                });
            }
            else {
                throw new Error('Must include modal ID when broadcasting this message.');
            }
        });

        // Message received when client wants to open a modal
        $scope.$on(configService.messages.openModal, function(msg, data) {
            if (data.modal) {
                $timeout(function() {
                    $scope.currentModal = data.modal;
                });
            }
            else {
                throw new Error('Must include modal ID when broadcasting this message.');
            }
        });

        // Function for when elements on the index.html want to open a modal
        $scope.openModal = function(modal) {
            $scope.currentModal = modal;
        }

        // Used on the modal directives to check whether each modal should be visible or not
        $scope.checkModal = function(modal) {
            return $scope.currentModal === modal;
        }

        // ------------- END Modal Functions ------------- \\


    });