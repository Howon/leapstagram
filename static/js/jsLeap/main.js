var map,
  columbiaLat = 40.8093675,
  columbiaLon = -73.9613624,
  currentLat = columbiaLat,
  currentLon = columbiaLon;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: columbiaLat, lng: columbiaLon},
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  detectMovement(map);
}

var isLocked = false;
var instagramLoaded = false;
document.onkeypress = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    // if (charCode) {
    //     alert("Character typed: " + String.fromCharCode(charCode));
    // }
    key = String.fromCharCode(charCode)
    console.log(key)

    /* Navigation*/
    if (key === 'w') {
        /* north*/
        if (isLocked && instagramLoaded) {
            console.log('Image up')
        } else if (!isLocked) {
            map.panBy(0, -10);
        }

    } else if (key === 'd') {
        /* east*/
        if (isLocked && instagramLoaded) {
            console.log('Image right')
        } else if (!isLocked) {
            map.panBy(10, 0);
        }
    } else if (key === 's') {
        /* south*/
        if (isLocked && instagramLoaded) {
            console.log('Image down')
        } else if (!isLocked) {
            map.panBy(0, 10);
        }

    } else if (key === 'a') {
        /* west*/
        if (isLocked && instagramLoaded) {
            console.log('Image west')
        } else if (!isLocked) {
            map.panBy(-10, 0);
        }

    } else if (key === 'j' && !isLocked) {
        /* zoom in*/
        map.setZoom(map.getZoom() + 1)

    } else if (key === 'k' && !isLocked) {
        /* zoom out*/
        map.setZoom(map.getZoom() - 1)

    } else if (key === 'l') { /* toggle gesture*/
        /* isLocked*/
        isLocked = !isLocked;
    } else if (key === 'u' && isLocked) {
        console.log('Instagram call')
        instagramLoaded = !instagramLoaded;
    } else if (key === 'i' && isLocked && instagramLoaded) {
        console.log('tap')
    }
};
