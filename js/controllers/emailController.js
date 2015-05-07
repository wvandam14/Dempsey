soccerStats.controller('emailController', 
    function emailController($scope, $location, toastService, configService, $timeout, viewService) {

        $scope.goToPage = function(path) {
            //$timeout(function() {
                viewService.goToPage(path);
            //});
        }

		$scope.urlParams = {};
		window.onload = function() {
		    (function () {
		        var pair, // Really a match. Index 0 is the full match; 1 & 2 are the key & val.
		            tokenize = /([^&=]+)=?([^&]*)/g,
		            // decodeURIComponents escapes everything but will leave +s that should be ' '
		            re_space = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); },
		            // Substring to cut off the leading '?'
		            //console.log(window);
		            querystring = window.location.hash.split('?')[1];
		            console.log("Querystring: " + querystring);

		        while (pair = tokenize.exec(querystring))
		           $scope.urlParams[re_space(pair[1])] = re_space(pair[2]);
		    })();

		    var base = 'https://www.parse.com';
		    var id = $scope.urlParams['id'];
		    document.getElementById('form').setAttribute('action', base + '/apps/' + id + '/request_password_reset');
		    document.getElementById('username').value = $scope.urlParams['username'];
		    //document.getElementById('username_label').appendChild(document.createTextNode($scope.urlParams['username']));

		    document.getElementById('token').value = $scope.urlParams['token'];
		    if ($scope.urlParams['error']) {
		      document.getElementById('error').appendChild(document.createTextNode($scope.urlParams['error']));
		    }
		 //    if ($scope.urlParams['app']) {
		 //      document.getElementById('app').appendChild(document.createTextNode(' for ' + $scope.urlParams['app']));
			// }
		}
		console.log($scope.urlParams);
    	
    });
