soccerStats.factory('registerService', function ($location, $timeout, dataService, configService) {

    var
        registerTeam = function(newTeam) {
            var Team = Parse.Object.extend("Team");
            var _team = new Team();
            _team.set("ageGroup", newTeam.ageGroup);
            _team.set("city", newTeam.city);
            _team.set("leagueName", newTeam.leagueName);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", (_.invert(dataService.states))[newTeam.state]);
            _team.set("logo", newTeam.logo);
            _team.set("primaryColor", newTeam.primaryColor);

            return _team;
        };

    return {
        registerTeam: registerTeam
    }

});