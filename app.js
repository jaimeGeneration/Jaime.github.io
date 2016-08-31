/*var app = angular.module('myApp', []);




app.controller('myCtrl', function($scope, $http) {
  $("input").on("keydown",function search(e) {
    if(e.keyCode == 13) {
  $http.get("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + $('#search').val() + "&api_key=68205356a6b087418508c170d62c6e5e&format=json")
  .then(function(response) {
      $scope.myWelcome = response.data;
//console.log($scope.myWelcome);
});
}
});
});
$('#map').hide();
$('.see').on( "click", function(){
  $('#map').show();

});

*/
 $(document).ready(function(){
  $(window).scroll(function(){
  if ( $(this).scrollTop() >= 500 ) {
      $(".Top").fadeIn();
  }
  else {
    $(".Top").fadeOut();
  }
  });
  $(".Top").click(function(){
    $("html,body").stop().animate({scrollTop : 0});
  });

});



angular.module('myApp', ["ngTextTruncate"])

.service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
})

.controller('ScrollCtrl', function($scope, $location, anchorSmoothScroll) {
    
    $scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('songs');
 
      // call $anchorScroll()
      anchorSmoothScroll.scrollTo(eID);
      
    };
  })
  .controller('myCtrl', function($scope, $http) {
    $scope.$watch('search', function() {
      fetch();
     
    });

     $scope.search = "radiohead";
    

    function fetch() {
      $http.get("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +  $scope.search + "&api_key=68205356a6b087418508c170d62c6e5e&format=json")
        .then(function(response) {
          $scope.details = response.data;
        //console.log($scope.details);
         $scope.bio = response.data.artist.bio.content.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ''); 
         // console.log($scope.bio);
          $scope.similar = response.data.artist.similar.artist;
         // console.log($scope.similar);
          var id = response.data.artist.mbid;
          sessionStorage.setItem("view", (id))
        
        });

     $http.get("http://api.bandsintown.com/artists/" +  $scope.search + "/events.json?api_version=2.0&app_id=YOUR_APP_ID")
        .then(function(response) {
          $scope.dates = response.data;
          //console.log($scope.dates)
         var lng = response.data[0].venue.longitude;
          var lat = response.data[0].venue.latitude;
           //sessionStorage.setItem("lng", (lng));
           //sessionStorage.setItem("lat", (lat));
          //console.log(lng);
          //console.log(lat);
        });

         $http.get("http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+  $scope.search + "&api_key=68205356a6b087418508c170d62c6e5e&artist=Cher&album=Believe&format=json")
        .then(function(response) {
          $scope.albums = response.data.topalbums.album;
           console.log($scope.albums);
    });
          
      

        setTimeout(function() {
    

        var Mbid = sessionStorage.getItem("view");
      
         console.log(Mbid);
          $http.get("http://api.setlist.fm/rest/0.1/artist/" +  Mbid  + "/setlists.json")
          .then(function(response) {
          $scope.tracks = response.data.setlists.setlist[0].sets.set;
          console.log( $scope.tracks);
          $scope.track = response.data.setlists.setlist[0].sets.set.song;
           console.log( $scope.track);
           $scope.status = response.statusText;
           }, function(response) {
          $scope.tracks ="";
           $scope.track ="";
          $scope.status = response.statusText;
          console.log( $scope.status);
         });
          }, 
        (2 * 1000));
};
      $scope.update = function(artist) {
      $scope.search = artist.name;
    };


 

})

.directive('albumDirective', function(){
    return{
      restrict: 'AE',
      replace: true,
      templateUrl: 'parts/album.html'
    };
  })

.directive('headerDirective', function(){
  return {
    restrict: 'AE',
    templateUrl: 'parts/header.html'
  }
})
.directive('footerDirective', function(){
  return {
    restrict: 'AE',
    templateUrl: 'parts/footer.html'
  }
})
.directive('tourDirective', function(){
  return {
    restrict: 'AE',
    templateUrl: 'parts/tour.html'
  }
})
.directive('songsDirective', function(){
  return {
    restrict: 'AE',
    templateUrl: 'parts/songs.html'
  }
});

   /* $scope.numLimit=350;
$scope.readMore=function(){
$scope.numLimit=100000;
$('#read').addClass('hidden');
};
 $.ajax ({
      type:'GET',
      url:"http://api.bandsintown.com/artists/""/events.json?api_version=2.0&app_id=YOUR_APP_ID",
      success: function(response){
              var related = response;
          console.log(related);
        }
});*/




 /*
  .directive('myMap', function() {
      // directive link function
      var link = function(scope, element, attrs) {
          var map, infoWindow;
          var markers = [];
          
          // map config
          var mapOptions = {
              center: new google.maps.LatLng(50, 2),
              zoom: 4,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              scrollwheel: false
          };
          
          // init the map
          function initMap() {
              if (map === void 0) {
                  map = new google.maps.Map(element[0], mapOptions);
              }
          }    
          
          // place a marker
          function setMarker(map, position, title, content) {
              var marker;
              var markerOptions = {
                  position: position,
                  map: map,
                  title: title,
                  icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
              };

              marker = new google.maps.Marker(markerOptions);
              markers.push(marker); // add marker to array
              
              google.maps.event.addListener(marker, 'click', function () {
                  // close window if not undefined
                  if (infoWindow !== void 0) {
                      infoWindow.close();
                  }
                  // create new window
                  var infoWindowOptions = {
                      content: content
                  };
                  infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                  infoWindow.open(map, marker);
              });
          }
         var lat =  sessionStorage.getItem("lat");
          var lng =  sessionStorage.getItem("lng");
          // show the map and place some markers
          initMap();
          
          setMarker(map, new google.maps.LatLng(lat, lng), 'London', 'Just some content');
          setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
          setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
      };


      
      return {
          restrict: 'A',
          template: '<div id="gmaps"></div>',
          replace: true,
          link: link
      };
  });


<div my-map=""></div>



    /*

function opendialog(page) {
  var $dialog = $('#somediv')
  .html('<iframe style="border: 0px; " src="' + page + '" width="100%" height="100%"></iframe>')
  .dialog({
    title: "Page",
    autoOpen: false,
    dialogClass: 'dialog_fixed,ui-widget-header',
    modal: true,
    height: 500,
    minWidth: 400,
    minHeight: 400,
    draggable:true,
    /*close: function () { $(this).remove(); },
    buttons: { "Ok": function () {         $(this).dialog("close"); } }
  });
  $dialog.dialog('open');
}



    $scope.select = function() {
      this.setSelectionRange(0, this.value.length);
    }
  });
  */