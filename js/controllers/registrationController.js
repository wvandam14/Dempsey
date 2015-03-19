soccerStats.controller('registrationController',
    function registrationController($scope, emailService, viewService) {
    	
        $scope.tabNumber = 2;
        $scope.formList = ['accountForm', 'teamForm', 'inviteForm'];

        $scope.setTab = function (tab) {
            if($scope.tabNumber > tab) {
                $scope.tabNumber = tab;
            }
            if(viewService.validateAreaByFormName($scope.formList[$scope.tabNumber]) && tab === ($scope.tabNumber + 1)) {
                $scope.tabNumber = tab;
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
                // TODO: pop up toast notification that they suck
            }
        };

        $scope.removeEmail = function (index){
            $scope.inviteEmails.splice(index, 1);
        }

		//user register
		//need to make sure database and user submission is consistent 
        $scope.newUser = {
            name: '',
            email: '',
            password: '',
            phone: '',
            city: '',
            state: ''
        };

        $scope.team = {
            logo: '',
            name: '',
            number: '',
            league_name: '',
            age_group: '',
            city: '',
            state: ''
        };

        //TODO: accountType in parse?
        $scope.register = function (newUser, newTeam) {
            var registerUser = new Parse.User();
            registerUser.set("username", newUser.email);
            registerUser.set("name", newUser.name);
            registerUser.set("email", newUser.email);
            registerUser.set("password", newUser.password);
            registerUser.set("phone", newUser.phone);
            registerUser.set("city", newUser.city);
            registerUser.set("state", newUser.state.value);

            registerUser.signUp(null, {
                success: function (registerUser) {
                    alert("registration successful");
                },
                error: function (registerUser, error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });

            var Team = Parse.Object.extend("Team");
            var _team = new Team();

            _team.set("age_group", newTeam.age_group.value);
            _team.set("city", newTeam.city);
            _team.set("league_name", newTeam.leagueName);
            //TODO _team.set("logo", newTeam.logo);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", newTeam.state.value);

            _team.save(null, {
                success: function (_team) {
                    alert("Team registered");
                },
                error: function (_team, error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        };

        // Sends email via the cloud code with parse
        $scope.sendEmailInvite = function() {
            // Todo: Email Service testing only
            emailService.sendEmailInvite('Gordon', '123', 'Seattle Sounders FC', 'alecmmoore@gmail.com');
        };

        $scope.age_groups = [
            { value: "", label: "Select an age group..." },
            { value: "U12", label: "U12" },
            { value: "U16", label: "U16" }
        ];
        $scope.team.age_group = $scope.age_groups[0];

        $scope.states = [
	        {value:   "", label: "Select a State"},
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
        $scope.newUser.state = $scope.states[0];
        $scope.team.state = $scope.states[0];
    });