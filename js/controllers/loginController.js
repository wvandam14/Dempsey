// controller in charge of user login
soccerStats.controller('loginController', function loginController($scope, $rootScope, $timeout, $location, viewService, toastService, configService, dataService) {
        // User object
        $scope.user = {email: '', password: ''};

        $scope.init = function() {
            if (Parse.User.current()) {
                $scope.goToPage('/home');
            }
        };
        $timeout(function() {
            $scope.init();
        });

        $scope.goToPage = function(path) {
            viewService.goToPage(path);
        }

        // user login
        $scope.login = function(user) {
            if (viewService.validateAreaByFormName('loginForm')) {
                Parse.User.logIn(user.email, user.password, {
                    success: function (user) {
                        ///console.log(user);
                        var name = user.get('name');
                        toastService.success(configService.toasts.loginSuccess(
                            name === undefined ? "parent. Please edit your profile" : name)
                        );
                        $scope.goToPage('/home');
                        $rootScope.$broadcast(configService.messages.loginSuccess);

                        // dataService.getTeams( function(_teams) {
                        //     dataService.setCurrentTeam(_teams[0]);
                        //      $timeout(function() {
                        //        $rootScope.$broadcast(configService.messages.teamChanged, {team: _teams[0]});
                        //     });
                   
                        // });
                    },
                    error: function(user, error) {
                        toastService.error(configService.toasts.notAuthenticated);
                    }
                });
            } else {
                toastService.error(configService.toasts.requiredFields);
            }
        };

        // reset password modal
        $scope.resetPassword = function() {
            viewService.openModal('passwordResetModal');
            // $scope.user.email
            // Parse.User.requestPasswordReset($scope.user.email, {
            //     success:function() {
            //         alert("Reset instructions emailed to you.");
            //     },
            //     error:function(error) {
            //         alert(error.message);
            //     }
            // });
        }

    });
