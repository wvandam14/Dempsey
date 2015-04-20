soccerStats.factory('dataService', function ($location, $timeout, configService, toastService) {

    var
         ageGroups = { "U12" : "U12" , "U16" : "U16", "U18" : "U18", "U20" : "U20", "U23" : "U23" }
        , states = {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District Of Columbia",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"}
        
        // Current focus variables
        , getCurrentUser = function() {
            return Parse.User.current();
        }
        , currentPlayer = {}
        , currentTeam = {}
        , currentGame = {}


        // Parse Tables
        , playersTable = Parse.Object.extend("Players")
        , userTable = Parse.Object.extend("_User")
        , teamTable = Parse.Object.extend("Team")
        , playerStatsTable = Parse.Object.extend("SeasonPlayerStats")
        , gameTable = Parse.Object.extend("Game")

        // Team Table        
        , setCurrentTeam = function(team) {
            currentTeam = team;
        }

        ,getCurrentTeam = function() {
            return currentTeam;
        }

        , getTeams = function(callback) {
            var teamDict = [];
            var query = new Parse.Query(userTable);
            var currentUser = Parse.User.current();
            // console.log(currentUser);
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
                                id: team.id,
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
        getPlayers = function(callback) {
            var dictionary = [];
            var currentUser = getCurrentUser();
            var query = new Parse.Query(userTable);
            query.include('players');
            query.get(currentUser.id, {
                success: function (user) {
                    $timeout(function() {
                        var players = user.get("players");
                        _.each(players, function (player) {
                            var photo = player.get("photo"),
                                name = player.get("name"),
                                birthday = player.get("birthday"),
                                team = player.get("team"),
                                jerseyNumber = player.get("jerseyNumber"),
                                city = player.get("city"),
                                state = player.get("state"),
                                contact = {
                                    emergencyContact : player.get("emergencyContact"),
                                    phone : player.get("phone"),
                                    relationship : player.get("relationship")
                                }
                            ;
                            dictionary.push({
                                photo : photo,
                                name : name,
                                birthday : birthday,
                                team : team,
                                jerseyNumber : jerseyNumber,
                                city : city,
                                state : state,
                                contact : contact,
                                id : player.id
                            });
                        });
                        
                        callback(dictionary);
                    });
                    
                },
                error: function (user, error) {

                }
            });
            return dictionary;
        },
        getTeamById = function(id, callback) {
            var query = new Parse.Query(teamTable);
            query.equalTo('objectId', id);
            query.first({
                success: function(team) {
                    $timeout(function(){
                        callback(team);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        , registerTeam = function(newTeam) {
            var _team = new teamTable();
            _team.set("ageGroup", newTeam.ageGroup);
            _team.set("city", newTeam.city);
            _team.set("leagueName", newTeam.leagueName);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", (_.invert(states))[newTeam.state]);
            _team.set("logo", newTeam.logo);
            _team.set("primaryColor", newTeam.primaryColor);

            return _team;
        }

        // Player Table
        , getPlayersByTeamId = function(id, callback) {
            var query = new Parse.Query(playersTable);
            query.equalTo('team', {
                __type: "Pointer",
                className: "Team",
                objectId: id
            });
            query.find({
                success: function(players) {
                    $timeout(function(){
                        callback(players);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        , getSeasonPlayerStatsByPlayerId = function(id, callback) {
            var query = new Parse.Query(playerStatsTable);
            query.equalTo('player', {
                __type: "Pointer",
                className: "Players",
                objectId : id
            });
            query.first({
                success: function(playerStats) {
                    $timeout(function() {
                        callback(playerStats);
                    });
                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        },

        getGames = function(_team,callback){

                var team = new teamTable();
                var query = new Parse.Query(gameTable);


                team.id = _team.id;
                team.fetch().then(function(team){

                    // /console.log(team.get('name'));

                    query.equalTo('team',team);
                    query.include('gameTeamStats');
                    query.find().then(function(games_brute){
                        var game;
                        var games = [];
                        
                        for(var i = 0; i < games_brute.length; i++ ){

                           game = {
                                date: games_brute[i].get("date"),
                                opponent: {
                                    name: games_brute[i].get("opponent"),
                                    symbol: games_brute[i].get("opponentSymbol"),
                                    score: games_brute[i].get("gameTeamStats").get("goalsTaken")
                                },
                                team: {
                                    name: team.get("name"),
                                    symbol: team.get("symbol"),
                                    score: games_brute[i].get("gameTeamStats").get("goalsMade")
                                },
                                status: games_brute[i].get("status")
                            }
                            games.push(game);
                        }

                    callback(games);
                }, function(error){
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");

                });
            });
        }






        ;

    return {
        ageGroups: ageGroups,
        states : states,
        getTeams : getTeams,
        getTeamById : getTeamById,
        getPlayersByTeamId : getPlayersByTeamId,
        setCurrentTeam : setCurrentTeam,
        getCurrentTeam : getCurrentTeam,
        registerTeam : registerTeam,
        getPlayers: getPlayers,
        getCurrentUser: getCurrentUser,
        getSeasonPlayerStatsByPlayerId : getSeasonPlayerStatsByPlayerId,
        getGames : getGames
    }

});