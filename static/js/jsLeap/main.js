var map,
  columbiaLat = 40.8093675,
  columbiaLon = -73.9613624,
  currentLat = columbiaLat,
  currentLon = columbiaLon;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: columbiaLat,
      lng: columbiaLon
    },
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
}

const minValue = 1;

function GestureState() {
  this.numFists = 0;
  this.openHand = 0;
  this.isFisting = false;
  this.locked = true;
}

const MAXXPOS = 225;
const MAXYPOS = 185;
const MAXZPOS = 300;

function Gesture(xpos, ypos, zpos, isLocked) {
  if (!isLocked) {
    xpos -= 30;
    ypos += 20;
    if (xpos > MAXXPOS) xpos = MAXXPOS;
    if (ypos > MAXYPOS) ypos = MAXYPOS;
    if (zpos > MAXZPOS) zpos = MAXZPOS;
    if (xpos < -MAXXPOS) xpos = -MAXXPOS;
    if (ypos < -MAXYPOS) ypos = -MAXYPOS;
    if (zpos < -MAXZPOS) zpos = -MAXZPOS;


    this.xpos = xpos / MAXXPOS;
    this.ypos = ypos / MAXYPOS;
    this.zpos = zpos / MAXZPOS;
  } else {
    this.xpos = 0;
    this.ypos = 0;
    this.zpos = 0;
  }
}

var gstate = new GestureState();

// Set up the controller:
Leap.loop({
  background: true
}, function(frame) {
  if (frame.hands.length > 0) {
    var hand = frame.hands[0];
    var position = hand.palmPosition;
    var velocity = hand.palmVelocity;
    var direction = hand.direction;
    var locked = false;
    if (checkFist(hand)) {
      if (gstate.numFists++ > 15) {
        if (!gstate.isFisting) {
          gstate.isFisting = true;
          gstate.locked = !gstate.locked;
        }
      }
    } else {
      gstate.numFists = 0;
      gstate.isFisting = false;
    }

    var gesture = new Gesture(position[0], -position[2], position[1], gstate.locked);
    navigateInstaLeap(gesture);
  } else {
    gstate = new GestureState();
  }
});


function getExtendedFingers(hand) {
  var f = 0;
  for (var i = 0; i < hand.fingers.length; i++) {
    if (hand.fingers[i].extended) {
      f++;
    }
  }
  return f;
}

function checkFist(hand) {
  var sum = 0;
  for (var i = 0; i < hand.fingers.length; i++) {
    var finger = hand.fingers[i];
    var meta = finger.bones[0].direction();
    var proxi = finger.bones[1].direction();
    var inter = finger.bones[2].direction();
    var dMetaProxi = Leap.vec3.dot(meta, proxi);
    var dProxiInter = Leap.vec3.dot(proxi, inter);
    sum += dMetaProxi;
    sum += dProxiInter
  }
  sum = sum / 10;

  if (sum <= minValue && getExtendedFingers(hand) == 0) {
    return true;
  } else {
    return false;
  }
}

var isLocked = false;
var instagramLoaded = false;

var navigateInstaLeap = function(gesture) {
  console.log(gesture)
  console.log(gesture)

  // /* Navigation*/
  // if (key === 'w') {
  //   /* north*/
  //   if (isLocked && instagramLoaded) {
  //     console.log('Image up')
  //   } else if (!isLocked) {
  //     map.panBy(0, -10);
  //   }

  // } else if (key === 'd') {
  //   /* east*/
  //   if (isLocked && instagramLoaded) {
  //     console.log('Image right')
  //   } else if (!isLocked) {
  //     map.panBy(10, 0);
  //   }
  // } else if (key === 's') {
  //   /* south*/
  //   if (isLocked && instagramLoaded) {
  //     console.log('Image down')
  //   } else if (!isLocked) {
  //     map.panBy(0, 10);
  //   }

  // } else if (key === 'a') {
  //   /* west*/
  //   if (isLocked && instagramLoaded) {
  //     console.log('Image west')
  //   } else if (!isLocked) {
  //     map.panBy(-10, 0);
  //   }

  // } else if (key === 'j' && !isLocked) {
  //   /* zoom in*/
  //   map.setZoom(map.getZoom() + 1)

  // } else if (key === 'k' && !isLocked) {
  //   /* zoom out*/
  //   map.setZoom(map.getZoom() - 1)

  // } else if (key === 'l') { /* toggle gesture*/
  //   /* isLocked*/
  //   isLocked = !isLocked;
  // } else if (key === 'u' && isLocked) {
  //   console.log('Instagram call')
  //   instagramLoaded = !instagramLoaded;
  // } else if (key === 'i' && isLocked && instagramLoaded) {
  //   console.log('tap')
  // }
};



// Adds the rigged hand and playback plugins
// to a given controller, providing a cool demo.
visualizeHand = function(controller) {
  // The leap-plugin file included above gives us a number of plugins out of the box
  // To use a plugins, we call `.use` on the controller with options for the plugin.
  // See js.leapmotion.com/plugins for more info

  controller.use('playback', {
    // This is a compressed JSON file of preprecorded frame data
    recording: 'finger-angle-43fps.json.lz',
    // How long, in ms, between repeating the recording.
    timeBetweenLoops: 1000,
    pauseOnHand: true
  }).on('riggedHand.meshAdded', function(handMesh, leapHand) {
    handMesh.material.opacity = 1;
  });

  var overlay = controller.plugins.playback.player.overlay;
  overlay.style.right = 0;
  overlay.style.left = 'auto';
  overlay.style.top = 'auto';
  overlay.style.padding = 0;
  overlay.style.bottom = '13px';
  overlay.style.width = '180px';

  controller.use('riggedHand', {
    scale: 1,
  });

  var camera = controller.plugins.riggedHand.camera;
  camera.position.set(-8, 8, 20);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
};
visualizeHand(Leap.loopController);