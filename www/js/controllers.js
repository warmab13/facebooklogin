angular.module('starter.controllers', ['ionic', 'ngCordova', 'ngCordovaOauth'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $cordovaOauth, $window, $location) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.login = function() {
        $cordovaOauth.facebook("230023887411447", ["email", "user_website", "user_location", "user_relationships"]).then(function(result) {
            $window.localStorage.accessToken = result.access_token;
            $location.path("/profile");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };
})
.controller('ProfileCtrl', function($scope, $http, $window, $location){
  $scope.init = function(){
     if($window.localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me",
             { params: { access_token: $window.localStorage.accessToken, 
              fields: "id,name,gender,location,website,picture,relationship_status", 
              format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
  }
  
})
.controller('CameraController',  function($scope, $cordovaCamera){
  $scope.takePicture = function(){
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA, 
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData){
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err){
      alert("La foto no pudo ser tomada " + err);
    })
  }

 
});
