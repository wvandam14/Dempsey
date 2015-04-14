soccerStats.factory('dataService', function ($location, $timeout, configService, toastService) {

    var
        ageGroups = {
                "U12" : "U12" ,
                "U16" : "U16",
                "U18" : "U18",
                "U20" : "U20",
                "U23" : "U23" 
        },
        states = {
                "AL" : "Alabama",
                "AK" : "Alaska",
                "AZ" : "Arizona",
                "AR" : "Arkansas",
                "CA" : "California",
                "CO" : "Colorado",
                "CT" : "Connecticut",
                "DE" : "Delaware",
                "DC" : "District Of Columbia",
                "FL" : "Florida",
                "GA" : "Georgia",
                "HI" : "Hawaii",
                "ID" : "Idaho",
                "IL" : "Illinois",
                "IN" : "Indiana",
                "IA" : "Iowa",
                "KS" : "Kansas",
                "KY" : "Kentucky",
                "LA" : "Louisiana",
                "ME" : "Maine",
                "MD" : "Maryland",
                "MA" : "Massachusetts",
                "MI" : "Michigan",
                "MN" : "Minnesota",
                "MS" : "Mississippi",
                "MO" : "Missouri",
                "MT" : "Montana",
                "NE" : "Nebraska",
                "NV" : "Nevada",
                "NH" : "New Hampshire",
                "NJ" : "New Jersey",
                "NM" : "New Mexico",
                "NY" : "New York",
                "NC" : "North Carolina",
                "ND" : "North Dakota",
                "OH" : "Ohio",
                "OK" : "Oklahoma",
                "OR" : "Oregon",
                "PA" : "Pennsylvania",
                "RI" : "Rhode Island",
                "SC" : "South Carolina",
                "SD" : "South Dakota",
                "TN" : "Tennessee",
                "TX" : "Texas",
                "UT" : "Utah",
                "VT" : "Vermont",
                "VA" : "Virginia",
                "WA" : "Washington",
                "WV" : "West Virginia",
                "WI" : "Wisconsin",
                "WY" : "Wyoming"
        },
        getTeams = function(callback) {
            var teamDict = [];
            var currentUser = Parse.User.current();
            var userTable = Parse.Object.extend("_User");

            var query = new Parse.Query(userTable);
            query.include('teams');
            query.get(currentUser.id, {
                success: function(user) {
                    $timeout(function(){
                        var teams = user.get("teams");
                        // Add each team associated with the current user to the team dropdown list
                        _.each(teams, function (team) {
                            var leagueName = team.get("leagueName"),
                                logo = team.get("logo"),
                                teamName = team.get("name"),
                                ageGroup = team.get("ageGroup"),
                                city = team.get("city"),
                                teamNumber = team.get("number"),
                                state = team.get("state"),
                                primaryColor = team.get("primaryColor")
                            ;
                            teamDict.push({
                                league: leagueName,
                                value: team.id, 
                                label: teamName, 
                                logo: logo._url,
                                age: ageGroup,
                                city: city,
                                number: teamNumber,
                                state: state,
                                color: primaryColor 
                            });
                        });

                        callback(teamDict);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
            return teamDict;
        },
        currentTeam = {},
        setCurrentTeam = function(team) {
            currentTeam = team;
        },
        getCurrentTeam = function() {
            return currentTeam;
        },

        registerTeam = function(newTeam) {
            var Team = Parse.Object.extend("Team");
            var _team = new Team();
            _team.set("ageGroup", newTeam.ageGroup);
            _team.set("city", newTeam.city);
            _team.set("leagueName", newTeam.leagueName);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", (_.invert(states))[newTeam.state]);
            if (newTeam.logo) {
                _team.set("logo", newTeam.logo);
                _team.set("primaryColor", newTeam.primaryColor);
            }

            return _team;
        };



    return {
        ageGroups: ageGroups,
        states : states,
        getTeams : getTeams,
        currentTeam: currentTeam,
        setCurrentTeam : setCurrentTeam,
        getCurrentTeam : getCurrentTeam,
        registerTeam : registerTeam
    }

});