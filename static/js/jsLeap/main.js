var map,
  mapInitialized = false,
  zoomLevel = 17,
  columbiaLat = 40.8093675,
  columbiaLon = -73.9613624,
  currentLat = columbiaLat,
  currentLon = columbiaLon;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: columbiaLat,
      lng: columbiaLon
    },
    zoom: zoomLevel,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });
  mapInitialized = true;

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
  this.numPalmMovingUp = 0;
  this.numPalmMovingDown = 0;
  this.isPalmMovingUp = false;
  this.isPalmMovingDown = false;
  this.palmCoolDown = 0;
}

const MAXXPOS = 225;
const MAXYPOS = 185;
const MAXZPOS = 300;
const PALMMOVEFRAMERATE = 4;
const PALMCOOLDOWN = 40;
const PALMMOVEVELOCTIY = 500;
const FISTFRAMERATE = 20;

function Gesture(xpos, ypos, zpos, pdirection, normalUp, isLocked) {
  if (!isLocked) {
    xpos -= 30;
    ypos += 20;
    if (xpos > MAXXPOS) xpos = MAXXPOS;
    if (ypos > MAXYPOS) ypos = MAXYPOS;
    if (zpos > MAXZPOS) zpos = MAXZPOS;
    if (xpos < -MAXXPOS) xpos = -MAXXPOS;
    if (ypos < -MAXYPOS) ypos = -MAXYPOS;
    if (zpos < -MAXZPOS) zpos = -MAXZPOS;

    this.palmDirection = 0;
    this.normalUp = false;
    this.xpos = xpos / MAXXPOS;
    this.ypos = ypos / MAXYPOS;
    this.zpos = zpos / MAXZPOS;
  } else {
    this.xpos = 0;
    this.ypos = 0;
    this.zpos = 0;
    this.palmDirection = pdirection;
    this.normalUp = normalUp;
  }
}

var gstate = new GestureState();

Leap.loop({
  background: true,
  enableGestures: true
}, function(frame) {
  if (frame.hands.length > 0) {
    var hand = frame.hands[0];
    var position = hand.palmPosition;
    var velocity = hand.palmVelocity;
    var direction = hand.direction;
    var locked = false;

    var gesture;
    var palmMove = checkPalm(hand);
    var palmMoveDirection = 0;
    var zero_out_move_direction = false;
    if(gstate.palmCoolDown !== 0){
      zero_out_move_direction = true;
      gstate.palmCoolDown--;
    }
    if(palmMove === 1){
      gstate.isPalmMovingDown = false;
      gstate.numPalmMovingDown = 0;
      if(gstate.numPalmMovingUp++ > PALMMOVEFRAMERATE){
        if(!gstate.isPalmMovingUp){
          gstate.isPalmMovingUp = true;
          palmMoveDirection = 1;
          if(gstate.palmCoolDown == 0){
            gstate.palmCoolDown = PALMCOOLDOWN;
          }
        }
      }
    } else if(palmMove === -1) {
      gstate.isPalmMovingUp = false;
      gstate.numPalmMovingUp = 0;
      if(gstate.numPalmMovingDown++ > PALMMOVEFRAMERATE){
        if(!gstate.isPalmMovingDown){
          gstate.isPalmMovingDown = true;
          palmMoveDirection = -1;
          if(gstate.palmCoolDown == 0){
            gstate.palmCoolDown = PALMCOOLDOWN;
          }
        }
      }
    } else {
      gstate.isPalmMovingDown = false;
      gstate.isPalmMovingUp = false;
      gstate.numPalmMovingDown = 0;
      gstate.numPalmMovingUp = 0;
      palmMoveDirection = 0;
    }

    var normalUp = checkNormal(hand);

    if (checkFist(hand)) {
      if (gstate.numFists++ > FISTFRAMERATE) {
        if (!gstate.isFisting) {
          gstate.isFisting = true;
          gstate.locked = !gstate.locked;
        }
      }
    } else {
      gstate.numFists = 0;
      gstate.isFisting = false;
    }

    if(zero_out_move_direction){
        palmMoveDirection = 0;
    }

    gesture = new Gesture(position[0], -position[2], position[1], palmMoveDirection, normalUp, gstate.locked);
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

function checkNormal(hand) {
  return hand.palmNormal[1] > 0;
}

function checkPalm(hand) {
  var velocity = hand.palmVelocity[1];
  if(velocity > PALMMOVEVELOCTIY){
    return 1;
  } else if(velocity < -PALMMOVEVELOCTIY){
    return -1;
  }
  return 0;
}

var isLocked = false;
var currentZoomLevel = zoomLevel;

const MAPXVELOCITY = 100;
const MAPYVELOCITY = -150;

var navigateInstaLeap = function(gesture) {
  var isLocked = (gesture.xpos === 0 ) && (gesture.ypos === 0 ) && (gesture.zpos === 0 ) ? true : false;

  if(gesture.palmDirection !== 0){
    if(gesture.palmDirection === 1){
      if(gesture.normalUp){
        console.log("bring images");
      } else{
      currentZoomLevel = currentZoomLevel < 14 ? 14 : currentZoomLevel - 1;
      }
    } else {
      currentZoomLevel = currentZoomLevel > 20 ? 20 : currentZoomLevel + 1;
    }
    map.setZoom(currentZoomLevel);
  }
  if(mapInitialized){
    if(!isLocked){
      map.panBy(gesture.xpos * MAPXVELOCITY, gesture.ypos * MAPYVELOCITY);
    }
  }
};

visualizeHand = function(controller) {
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
