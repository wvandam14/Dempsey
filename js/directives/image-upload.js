soccerStats.directive('imageUpload', function ($timeout, toastService, configService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/image-upload.html",
        scope: {
            getColor : '&?',
            placeholder : '=',
            image: '='
        },
        link: function ($scope, element, attr) {
            var fileElement = $(element).find('input[type=file]').first();
            var img = $(element).find('img').first();

            //triggers file upload
            $scope.selectFile = function(){
                $(fileElement).trigger('click');
            }

            // 1000000 bytes = 1 megabyte
            var sizeLimit = 1000000;

            // Upload the selected picture
            $scope.fileNameChanged = function(files) {
                console.log("select file");

                var fileUploadControl = files;
                if (fileUploadControl.files.length > 0) {
                    if (files.files[0].size <= sizeLimit) {
                        var file = fileUploadControl.files[0];
                        var name = "photo." + file.type.split('/').pop();
                        var parseFile = new Parse.File(name, file);

                        $timeout(function () {
                            $scope.image = parseFile;
                        });

                        var reader = new FileReader();

                        reader.onloadend = function () {
                            $timeout(function () {
                                $scope.thisImage = reader.result;

                                // Send the primary color to the parent scope if the attribute is present
                                if ($scope.getColor) {
                                    var imageSource = new Image();
                                    imageSource.src = reader.result;

                                    var colorThief = new ColorThief();
                                    var color = colorThief.getColor(imageSource);

                                    $scope.getColor({color: "rgb(" + color[0] + ", "  +  color[1] + ", " + color[2] + ")"});
                                }

                            });
                        };
                        reader.readAsDataURL(file);

                    }
                    else {
                        toastService.error(configService.toasts.fileTooLarge(fileUploadControl.files[0].size));
                        $(fileElement).val('');
                    }
                }
            }

        },
        controller:function($scope){

        }
    };
});
