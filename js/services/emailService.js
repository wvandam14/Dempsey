// service that calls the call cloud to invite parents
soccerStats.factory('emailService', function (toastService) {

    var
    /*
        * Sends an email to a member when the admin invites members to join the team
        * This code is run on the Parse CloudCode and includes the correct parameters from the client
        * Params coachName: String, teamId: Parse Object ID, teamName: String, emailTo: String (Recipient's Email), tempPassword: String
        *
    */
        sendEmailInvite = function(coachName, teamId, teamName, emailTo) {

            toastService.info('Attempting to send email invites.', emailSuccess);
            // Run CloudCode script
           Parse.Cloud.run('sendEmailInvite', {coachName: coachName, teamId: teamId, teamName: teamName, emailTo: emailTo, tempPassword: getTempPassword()}, {
               success: function (result) {
                   //console.log(result);
                   //console.log('Email Sent!');
                   toastService.success('Email invites have been successfully sent!');
                   emailSuccess();
               },
               error: function (error) {
                   console.log(error);
                   toastService.error('Email invites failed to send. Please try again.');
               }
           });

       }

    // Empty placeholder for email success delegate
    function emailSuccess() {}

    function getTempPassword() {
        var array = new Uint32Array(1);
        var pass = window.crypto.getRandomValues(array);
        return pass[0].toString(36).slice(-8);
    }

    return {
        sendEmailInvite: sendEmailInvite
    }

});