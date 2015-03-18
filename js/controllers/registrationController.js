soccerStats.controller('registrationController',
    function registrationController($scope, $timeout) {
    	
        $scope.tabNumber = 1;

        $scope.setTab = function (tab) {
        	$scope.tabNumber = tab;
        };

        $scope.isTab = function (tab) {
        	return $scope.tabNumber === tab;
        };

        $scope.incrementTab = function () {
        	if($scope.tabNumber < 3) {
        		$scope.tabNumber++;
        	}
        };

        // Array containing the emails who will receive the invitation to the team
        $scope.inviteEmails = [];
        $scope.addEmail = function () {
            $scope.inviteEmails.push($scope.invite.email)
        };

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

        $scope.register = function (newUser, newTeam) {
            var registerUser = new Parse.User();
            //TODO: username?
            registerUser.set("username", newUser.name);
            registerUser.set("name", newUser.name);
            registerUser.set("email", newUser.email);
            registerUser.set("password", newUser.password);
            registerUser.set("phone", newUser.phone);
            registerUser.set("city", newUser.city);
            registerUser.set("state", newUser.state);

            registerUser.signUp(null, {
                success: function (registerUser) {
                    alert("registration successful");
                },
                error: function (registerUser, error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });

            //TODO: test team registration - age group table?
            var Team = Parse.Object.extend("Team");
            var _team = new Team();

            _team.set("age_group", '');
            _team.set("city", newTeam.city);
            _team.set("league_name", newTeam.leagueName);
            _team.set("logo", newTeam.logo);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", newTeam.state);

            _team.save(null, {
                success: function (_team) {
                    alert("Team registered");
                },
                error: function (_team, error) {
                    alert("failed to create new team");
                }
            });
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
    });