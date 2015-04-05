soccerStats.directive('teamModal', function (viewService, toastService, registerService, configService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/team-modal.html",
        controller: function($scope) {
            $scope.showTeamForm = false;
            // Team information
            $scope.team = {
                logo: '',
                primaryColor: '',
                name: '',
                number: '',
                leagueName: '',
                ageGroup: '',
                city: '',
                state: ''
            };

            // listener when 'Create A Team' is pressed from the dropdown menu on header
            $scope.$on('teamModal', function(event) {
                $scope.showTeamForm = true;
            });

            $scope.addNewTeam = function(newTeam) {
                var _team = registerService.registerTeam(newTeam);

                _team.save(null, {
                    success: function(_team) {
                        var currentUser = Parse.User.current();
                        currentUser.addUnique("teams", _team);
                        currentUser.save(null, {
                            success: function(currenUser) {
                                toastService.success(configService.toasts.teamAddSuccess);
                            },
                            error: function(currentUser, error) {
                                toastService.error("There was a an error (" + error.code +"). Please try again.");
                            }
                        });
                        
                    },
                    error: function(_team, error) {
                        toastService.error("There was a an error (" + error.code +"). Please try again.");
                    }
                });
            }

            $scope.goToPage = function(page) {
                viewService.goToPage(page);
            };

            //below are static arrays
            $scope.ageGroups = [
                { value: "U12", label: "U12" },
                { value: "U16", label: "U16" },
                { value: "U18", label: "U18" },
                { value: "U20", label: "U20" },
                { value: "U23", label: "U23" }
            ];

            $scope.states = [
                {value: "AL", label: "Alabama"},
                {value: "AK", label: "Alaska"},
                {value: "AZ", label: "Arizona"},
                {value: "AR", label: "Arkansas"},
                {value: "CA", label: "California"},
                {value: "CO", label: "Colorado"},
                {value: "CT", label: "Connecticut"},
                {value: "DE", label: "Delaware"},
                {value: "DC", label: "District Of Columbia"},
                {value: "FL", label: "Florida"},
                {value: "GA", label: "Georgia"},
                {value: "HI", label: "Hawaii"},
                {value: "ID", label: "Idaho"},
                {value: "IL", label: "Illinois"},
                {value: "IN", label: "Indiana"},
                {value: "IA", label: "Iowa"},
                {value: "KS", label: "Kansas"},
                {value: "KY", label: "Kentucky"},
                {value: "LA", label: "Louisiana"},
                {value: "ME", label: "Maine"},
                {value: "MD", label: "Maryland"},
                {value: "MA", label: "Massachusetts"},
                {value: "MI", label: "Michigan"},
                {value: "MN", label: "Minnesota"},
                {value: "MS", label: "Mississippi"},
                {value: "MO", label: "Missouri"},
                {value: "MT", label: "Montana"},
                {value: "NE", label: "Nebraska"},
                {value: "NV", label: "Nevada"},
                {value: "NH", label: "New Hampshire"},
                {value: "NJ", label: "New Jersey"},
                {value: "NM", label: "New Mexico"},
                {value: "NY", label: "New York"},
                {value: "NC", label: "North Carolina"},
                {value: "ND", label: "North Dakota"},
                {value: "OH", label: "Ohio"},
                {value: "OK", label: "Oklahoma"},
                {value: "OR", label: "Oregon"},
                {value: "PA", label: "Pennsylvania"},
                {value: "RI", label: "Rhode Island"},
                {value: "SC", label: "South Carolina"},
                {value: "SD", label: "South Dakota"},
                {value: "TN", label: "Tennessee"},
                {value: "TX", label: "Texas"},
                {value: "UT", label: "Utah"},
                {value: "VT", label: "Vermont"},
                {value: "VA", label: "Virginia"},
                {value: "WA", label: "Washington"},
                {value: "WV", label: "West Virginia"},
                {value: "WI", label: "Wisconsin"},
                {value: "WY", label: "Wyoming"}
            ];
        }
    };
});