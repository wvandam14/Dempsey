soccerStats.factory('emailService', function () {

    var
    /*
        * Sends an email to a member when the admin invites members to join the team
        * This code is run on the Parse CloudCode and includes the correct parameters from the client
        * Params coachName: String, teamId: Parse Object ID, teamName: String, emailTo: String (Recipient's Email), tempPassword: String
        *
    */
        sendEmailInvite = function(coachName, teamId, teamName, emailTo) {

           // Run CloudCode script
           Parse.Cloud.run('sendEmailInvite', {coachName: coachName, teamId: teamId, teamName: teamName, emailTo: emailTo, tempPassword: getTempPassword()}, {
               success: function (result) {
                   //console.log(result);
                   //console.log('Email Sent!');
               },
               error: function (error) {
                   //console.log(error);
                   //console.log('Email Failed.');
               }
           });

       }


    function getTempPassword() {
        var array = new Uint32Array(1);
        var pass = window.crypto.getRandomValues(array);
        return pass[0].toString(36).slice(-8);
    }



    return {
        sendEmailInvite: sendEmailInvite
    }

});