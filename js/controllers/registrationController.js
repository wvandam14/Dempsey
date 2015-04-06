soccerStats.controller('registrationController',
    function registrationController($scope, emailService, viewService, $timeout, toastService, configService) {
    	
        // Tab functionality
        $scope.tabNumber = 0;
        $scope.formList = ['accountForm', 'teamForm', 'inviteForm'];
        $scope.team = {}; //TODO: duplicate

        $scope.goToPage = function(page) {
            viewService.goToPage(page);
        };

        $scope.setTab = function (tab) {
            var currentForm = $scope.formList[$scope.tabNumber];

            // If the passwords do not match, don't allow them to continue
            if (!$scope.confirmPassword()) {
                toastService.error(configService.toasts.requiredFields);
                return;
            }

            // If you are going back in the registration process
            if ($scope.tabNumber > tab) {
                $scope.tabNumber = tab;
                return;
            }

            if (viewService.validateAreaByFormName(currentForm)
                && (tab === ($scope.tabNumber + 1))) {
                $scope.tabNumber = tab;
            }
            else {
                toastService.error(configService.toasts.requiredFields);
            }

        };

        $scope.isTab = function (tab) {
        	return $scope.tabNumber === tab;
        };

        $scope.incrementTab = function () {
        	$scope.setTab($scope.tabNumber + 1);
        };

        // Array containing the emails who will receive the invitation to the team
        $scope.inviteEmails = [];
        $scope.addEmail = function () {
            if(viewService.validateAreaByFormName("inviteForm")){
                $scope.inviteEmails.unshift($scope.invite.email);
            }
            else {
                toastService.error(configService.toasts.requiredFields);
            }
        };

        $scope.removeEmail = function (index){
            $scope.inviteEmails.splice(index, 1);
        }

        // Sends email via the cloud code with parse
        $scope.sendEmailInvite = function(newUser, team) {
            _.each($scope.inviteEmails, function (email) {
                emailService.sendEmailInvite(newUser.name, team.id, team.get("name"), email);
            });
        };

        $scope.registerTeam = function(newTeam) {
            var Team = Parse.Object.extend("Team");
            var _team = new Team();

            _team.set("ageGroup", newTeam.ageGroup.value);
            _team.set("city", newTeam.city);
            _team.set("leagueName", newTeam.leagueName);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", newTeam.state.value);
            _team.set("logo", newTeam.logo);
            _team.set("primaryColor", newTeam.primaryColor);

            return _team;
        };

		// User information
        $scope.newUser = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            city: '',
            state: '',
            photo: ''
        };

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


        
        //register coach
        $scope.register = function (newUser, newTeam) {
            var _team = $scope.registerTeam(newTeam);

            _team.save(null, {
                success: function (_team) {
                    var registerUser = new Parse.User();

                    registerUser.set("username", newUser.email);
                    registerUser.set("firstName", newUser.firstName);
                    registerUser.set("lastName", newUser.lastName);
                    registerUser.set("name", newUser.firstName + ' ' + newUser.lastName);
                    registerUser.set("email", newUser.email);
                    registerUser.set("password", newUser.password);
                    registerUser.set("phone", newUser.phone);
                    registerUser.set("city", newUser.city);
                    registerUser.set("state", newUser.state.value);
                    registerUser.set("photo", newUser.photo);
                    // Adds a pointer to the team to an array of pointers
                    //var relateTeam = registerUser.relation("teams");
                    //relateTeam.addUnique(_team);
                    registerUser.addUnique("teams", _team);
                    registerUser.set("accountType", 1);

                    //register team
                    registerUser.signUp(null, {
                        success: function (registerUser) {
                            toastService.success(configService.toasts.registrationSuccess);
                            $scope.sendEmailInvite(newUser, _team);
                            viewService.goToPage('/home');
                        },
                        error: function (registerUser, error) {
                            console.log("Error: " + error.code + " " + error.message);
                            toastService.error("There was a an error (" + error.code +"). Please try again.");

                        }
                    });

                },
                error: function (_team, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });

        };

        //compare new password with confirmation password
        $scope.confirmPassword = function() {
            return $scope.newUser.password === $scope.newUser.confirmPassword;
        };


        // Delegate function passed into the image upload directive for the color picker
        // Gets the most dominant color from the image upload directive
        // The function returns an array of three values: Red, Green and Blue
        $scope.getImageColor = function(color) {
            console.log('color');
            $scope.team.primaryColor = color;
        }

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

    });