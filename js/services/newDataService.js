// main data service for handling all query get and set requests to the parse database
soccerStats.factory('dataService', function ($location, $timeout, $rootScope, configService, toastService, emailService, viewService) {
    const connectionString = "http://localhost:3000";

    const http = {
        get: function(query, callback){
            endpoint  = connectionString + query;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    callback(this.responseText);
                }
            };
            xhttp.open("GET", query, true);
            xhttp.send();
        },
        put: function(query, data, callback){
            endpoint  = connectionString + query;
            var xhttp = new XMLHttpRequest();
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    callback(this.responseText);
                }
            };
            xhttp.open("PUT", query, true);
            xhttp.send(data);
        },
        post: function(query, data, callback){
            endpoint  = connectionString + query;
            var xhttp = new XMLHttpRequest();
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    callback(this.responseText);
                }
            };
            xhttp.open("POST", query, true);
            xhttp.send(data);
        },
        delete: function(callback){
            
        }
    }

    var
         ageGroups = { "U12" : "U12" , "U16" : "U16", "U18" : "U18", "U20" : "U20", "U23" : "U23" }     // static array of age groups
        , states = {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District Of Columbia",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"}    // static array of states

        , getCurrentUser = function(){
            return {
                id: "1",
                username: "wvandam",
                firstName: "Will",
                lastname: "Van Dam",
                name: "Will Van Dam",
                email: "wvandam14@my.whitworth.edu",
                password: "password",
                phone: "575-219-9362",
                city: "Spokane",
                state: "WA",
                photo: "1"
            }
        }
        , currentPlayer = {}
        , currentTeam = {}
        , currentGame = {}

        , playersTable = {
            id:"",
            name:"",
            firstName:"",
            lastName:"",
            birthday:"",
            team:"",
            jerseyNumber:"",
            city:"",
            state:"",
            emergencyContact:"",
            phone:"",
            relationship:"",
            playerStats:""
        }
        , coachesTable = {
            id:"",
            username:"",
            firstName:"",
            lastname:"",
            email:"",
            password:"",
            phone:"",
            city:"",
            state:"",
            photoID:""
        }
        , teamsTable = {
            name:"",
            city:"",
            state:"",
            ageGroup:"",
            leagueName:"",
            number:"",
            logoID:"",
            primaryColor:"",
            teamStatsID:"",
            coachID:""
        }
        , usersTable = {
            id:"",
            username:"",
            firstName:"",
            lastname:"",
            name:"",
            email:"",
            password:"",
            phone:"",
            city:"",
            state:"",
            photo:""
        }
        
        // get and set teams
        , setCurrentTeam = function(team) {
            currentTeam = team;
            //window.localStorage['currentTeam'] = JSON.stringify(currentTeam);
        }

        , getCurrentTeam = function() {
            //console.log(currentTeam);
            return currentTeam;
            //return JSON.parse( window.localStorage['currentTeam'] || '{}');
        }

        // get and set games
        , setCurrentGame = function (game) {
            currentGame = game;
        }

        , getCurrentGame = function() {
            return currentGame;
        }

        // get players associated with the current user
        , getPlayers = function(callback) {
            let dictionary = [];
            let currentUser = getCurentUser();
            let apiEndpoint = "/api/v1/user/" + currentUser.id + "/players";
            let playersCallback = function(result) {
                    // Typical action to be performed when the document is ready:
                    const players = JSON.parse(result);
                    _.each(players, function (player) {
                        // set up variables from player information
                        var photo = player.get("photo"),
                            name = player.get("name"),
                            birthday = player.get("birthday"),
                            team = player.get("team"),
                            jerseyNumber = player.get("jerseyNumber"),
                            city = player.get("city"),
                            state = player.get("state"),
                            contact = {
                                emergencyContact : player.get("emergencyContactName"),
                                phone : player.get("emergencContactPhone"),
                                relationship : player.get("emergencyContactRelationship")
                            };

                        // push variables into custom javascript objects for use
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
                    // return array
                    callback(dictionary);
                }
                http.get(apiEndpoint, playersCallback);
                return dictionary;
            }
            
        , getTeams = function(callback) {
            var teamDict = [];
            let currentUser = getCurrentUser();
            let apiEndpoint = "/api/v1/user/" + currentUser.id + "/teams";
            let teamsCallback = function(response) {
                const teams = JSON.parse(response);
                _.each(teams, function (team) {
                    teamDict.push(team);
                });
                // return the team array
                callback(teamDict);
            };
            http.get(apiEndpoint, teamsCallback);
            return teamDict;
        }


        // get games based on team id
        , getGames = function(_team,callback){
            var gamesDict = [];
            let team = new teamsTable();
            team.id = _team.id;
            
            let apiEndpoint = "/api/v1/team/" + team.id + "/games";

            let gamesCallback = function(response){
                let games_brute = JSON.parse(response);

                // get the team stats
                var game;

                // set up game objects
                for(var i = 0; i < games_brute.length; i++ ){
                    game = {
                        id: games_brute[i].id,
                        date: games_brute[i].get("date"),
                        opponent: {
                            name: games_brute[i].get("opponent"),
                            symbol: games_brute[i].get("opponentSymbol"),
                            score: games_brute[i].get("gameTeamStats").get("goalsTaken")
                        },
                        team: {
                            name: _team.get("name"),
                            symbol: _team.get("symbol"),
                            score: games_brute[i].get("gameTeamStats").get("goalsMade")
                        },
                        status: games_brute[i].get("status"),
                        notes: games_brute[i].get("gameNotes")
                    }
                    // push games into an array
                    gamesDict.push(game);
                }
                //console.log(games);
                // return games array
                callback(gamesDict);
            };

            http.get(apiEndpoint, gamesCallback);
            return gamesDict;
        }

        // register a team with a team passed in as a parameter - part 2 of registration process
        , registerTeam = function(newTeam) {
            var _team = new teamsTable();

            // set up a new team
            _team.set("ageGroup", newTeam.ageGroup);
            _team.set("city", newTeam.city);
            _team.set("leagueName", newTeam.leagueName);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", (_.invert(states))[newTeam.state]);
            _team.set("logo", newTeam.logo);
            _team.set("primaryColor", newTeam.primaryColor);
            //_team.set("teamStats", new SeasonTeamTable());
            
            // return parse object
            return _team;
        }

        // register a new coach - part 1 of registration process
        , registerCoach = function (newUser, _team, inviteEmails) {
            // create a new parse user object
            var registerUser = new usersTable();
            let apiEndpoint = "/api/v1/team/" + team.id + "/games";

            // set up new parse user information
            registerUser.set("username", newUser.email);
            registerUser.set("firstName", newUser.firstName);
            registerUser.set("lastName", newUser.lastName);
            registerUser.set("name", newUser.firstName + ' ' + newUser.lastName);
            registerUser.set("email", newUser.email);
            registerUser.set("password", newUser.password);
            registerUser.set("phone", newUser.phone);
            registerUser.set("city", newUser.city);
            registerUser.set("state", (_.invert(states))[newUser.state]);
            registerUser.set("photo", newUser.photo);

            // Adds a pointer to the team to an array of pointers
            //registerUser.addUnique("teams", _team);
            registerUser.set("accountType", 1);

            //register team

            http.post(apiEndpoint, registerUser, function(response) {
                toastService.success(configService.toasts.registrationSuccess);
                // part 3 of registration process
                sendEmailInvite(registerUser, _team.id, _team.get("name"), inviteEmails);
                viewService.goToPage('/home');  // redirect back to home
            });
        }



        // register a new team
        , registerNewTeam = function(_team, self) {
            var currentUser = getCurrentUser();
            let teamEndpoint = "/api/v1/team";
            // create a new team
            http.post(teamEndpoint, _team, function(response){
                let userEndpoint = "/api/v1/user";
                currentUser.addUnique("teams", _team);
                http.put(userEndpoint, currentUser, function(userResponse){
                    // update current user table
                    setCurrentTeam(_team);
                    toastService.success(configService.toasts.teamAddSuccess);
                    viewService.closeModal(self);
                    $rootScope.$broadcast(configService.messages.addNewTeam, _team);
                    $rootScope.$broadcast(configService.messages.teamChanged, {team: _team, refresh: true});
                });
            });
        }

        // get team based on team id
        , getTeamById = function(id, callback) {
            let apiEndpoint = "/api/v1/team/" + id;

            http.get(apiEndpoint, function(response){
                callback(JSON.parse(response));
            });
        }

        // get all the players associated with the team id
        , getPlayersByTeamId = function(id, callback) {
            let apiEndpoint = "/api/v1/team/" + id + "/players";

            http.get(apiEndpoint, function(response){
                callback(JSON.parse(response));
            });
        }

        // get season stats of player based on their id
        , getSeasonPlayerStatsByPlayerId = function(id, callback) {
            let apiEndpoint = "/api/v1/player/" + id + "/stats";

            http.get(apiEndpoint, function(response){
                callback(JSON.parse(response));
            });
        }

        // get player by player id in the case we need the whole parse object
        , getPlayerByPlayerId = function (playerID, callback) {
            let apiEndpoint = "/api/v1/player/" + playerID;

            http.get(apiEndpoint, function(response){
                callback(JSON.parse(response));
            });
        }

        // get game stats based on the game id
        , getGameStatsById = function(game_id){
            let apiEndpoint = "/api/v1/game/" + game_id + "/stats";
            var gameStats = {};

            http.get(apiEndpoint, function(response){
                gameStats = JSON.parse(response);
            });
            return gameStats;
        }

        // get game by game id in the case we need the whole parse object
        , getGameByGameId = function(gameId) {
            let apiEndpoint = "/api/v1/game/" + game_id;
            var game = {};

            http.get(apiEndpoint, function(response){
                game = JSON.parse(response);
            });
            return game;
        }





        , sendEmailInvite = function(user, teamID, teamName, inviteEmails, self) {
            _.each(inviteEmails, function (email) {
                emailService.sendEmailInvite(user.get("name"), teamID, teamName, email);
            });
            viewService.closeModal(self);
        }
});