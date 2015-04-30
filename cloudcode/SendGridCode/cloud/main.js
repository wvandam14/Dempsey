
Parse.Cloud.define("sendEmailInvite", function(request, response) {
    // Require sendgrid node api
    var sendgrid = require("sendgrid");
    sendgrid.initialize("alecm00re", "$occerStats123");

    var email;
    var emailBody;

    var coachName = request.params.coachName;
    var teamId = request.params.teamId;
    var teamName = request.params.teamName;
    var userEmail = request.params.emailTo;
    var tempPassword = request.params.tempPassword;

    // Query for whether the user exists in the User table already
    var query = new Parse.Query("User");
    query.equalTo("email", userEmail);
    query.find({
        success: function(results) {
            // If results.length is 0 then the user does not exist
            if (results.length <= 0) {

                // Generate temporary password for email and account creation

                emailBody = "<p style='font-family:sans-serif;'>" +
                    "Hi There! " +
                    "<br/><br/>You have been invited to Soccer Stats by <i>" + coachName + "</i> with the team <b>" + teamName + "</b>! " +
                    "<br/><br/>To login, go to <a href='http://alecmmoore.github.io#/login?teamid=" + teamId + "'>http://alecmmoore.github.io#/login?teamid=" + teamId + "</a> and use your email and temporary password to log in. You can change your password once you have already logged in." +
                    "<br/><br/><br/><br/>" +
                    "Email: <b>" + userEmail + "</b> " +
                    "<br/><br/>" +
                    "Temporary Password: <b>" + tempPassword + "</b><br/> " +
                    "<br/><br/><br/><br/>" +
                    "Please logon and register your player.<br/><br/>" +
                    "Thanks!" +
                    "<br/>" +
                    "Soccer Stats Development Team</p>";

                var Teams = Parse.Object.extend("Team");
                var teams = new Parse.Query(Teams);
                teams.equalTo("objectId", teamId);
                teams.find({
                    success: function(_team) {
                        console.log(_team);
                        var user = new Parse.User();
                        user.set("username", userEmail);
                        user.set("password", tempPassword);
                        user.set("email", userEmail);
                        user.addUnique("teams", _team[0]);
                        user.set("accountType", 2);

                        user.signUp(null, {
                            success: function(user) {
                                // Send Email to new user
                                email = sendgrid.Email({to: userEmail});
                                email.setFrom('no-reply@soccerstats.com');
                                email.setFromName('Soccer Stats');
                                email.setSubject('Welcome to Soccer Stats!');
                                email.setHTML(emailBody);

                                sendgrid.sendEmail(email).then(
                                    function(httpResponse) {
                                        console.log(httpResponse);
                                        response.success("Email sent!");
                                    },
                                    function(httpResponse) {
                                        console.error(httpResponse);
                                        response.error(httpResponse);
                                    });
                            },
                            error: function(user, error) {
                                // Error
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });
                    },
                    error: function(error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            }
            else {
                emailBody = "<p style='font-family:sans-serif;'>" +
                    "Hi There! " +
                    "<br/><br/>You have been invited to Soccer Stats by <i>"
                    + coachName + "</i> with the team <b>" + teamName + "</b>! " +
                    "<br/><br/>" +
                    "Looks like you already have an account with us, so go ahead and log in at http://alecmmoore.github.io#/login to accept the invitation." +
                    "<br/><br/><br/><br/>" +
                    "Please logon and register your player." +
                    "Thanks!" +
                    "<br/>" +
                    "Soccer Stats Development Team</p>";


                var Teams = Parse.Object.extend("Team");
                var teams = new Parse.Query(Teams);
                teams.equalTo("objectId", teamId);
                teams.find({
                    success: function(_teams){
                        Parse.Cloud.useMasterKey();

                        results[0].addUnique("teams", _teams[0]);
                        results[0].save(null, {
                            success: function (data) {
                                email = sendgrid.Email({to: userEmail});
                                email.setFrom('no-reply@soccerstats.com');
                                email.setFromName('Soccer Stats');
                                email.setSubject('Welcome to Soccer Stats!');
                                email.setHTML(emailBody);

                                sendgrid.sendEmail(email).then(
                                    function (httpResponse) {
                                        console.log(httpResponse);
                                        response.success("Email sent!");
                                    },
                                    function (httpResponse) {
                                        console.error(httpResponse);
                                        response.error(httpResponse);
                                    });
                            }, error: function (obj, error) {
                                response.error(error);
                            }
                        });
                    },
                    error: function(user, error){
                        console.log("Error: " + error.code + " " + error.message);
                    }
                })



            }
        },
        error: function() {
            response.error("User lookup failed");
        }
    });

});

Parse.Cloud.define("registerPlayer", function(request, response) {

    var newPlayerId = request.params.newPlayerId;
    var parentId = request.params.parentId;

    
    var playerTable = Parse.Object.extend("Players");
    var query = new Parse.Query(playerTable);

    query.equalTo("objectId", newPlayerId);
    query.first({
        success: function(player) {
            var userTable = Parse.Object.extend("_User");
            var parentQuery = new Parse.Query(userTable);
            parentQuery.equalTo("objectId", parentId);
            parentQuery.first({
                success: function(user) {
                    Parse.Cloud.useMasterKey();
                    user.addUnique("players", player);
                    user.save(null, {
                        success: function (user) {
                            response.success('player added');
                        },
                        erorr: function (user, error) {
                             response.error(error);
                        }
                    });
                },
                error: function(user, error) {
                    response.error(error);
                }
            });
        },
        error: function(player, error) {
            response.error(error);
        }
    });

    
});
