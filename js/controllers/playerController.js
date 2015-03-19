soccerStats.controller('playerController', function loginController($scope, $rootScope, $location, viewService) {
        // User object
        $scope.player = {
            name: '',
            team: '',
            number: '',
            city: '',
            state: '',
            emergencyContact: {
                name: '',
                phone: '',
                relationship: ''
            }

        };

        $scope.goToPage = function(path) {
            $timeout(function() {
                viewService.goToPage(path);
            });
        }

        $scope.registerPlayer = function(player) {
            if (viewService.validateAreaByFormName('playerForm')) {
                Parse.User.logIn(user.name, user.password, {
                    success: function (player) {
                        $scope.goToPage('/home');
                    },
                    error: function(player, error) {
                        // Todo: Send Toast notification that the registration was unsuccessful based on the error given
                    }
                });
            } else {
                // Todo: Send Toast notification that the form is invalid
            }
        };

    });
