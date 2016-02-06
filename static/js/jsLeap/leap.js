window.TO_DEG = 180 / Math.PI;

const minValue = 1;

function GestureState(){
	this.numFists = 0;
	this.openHand = 0;
	this.isFisting = false;
	this.locked = true;
}

const MAXXPOS = 225;
const MAXYPOS = 185;
const MAXZPOS = 300;

function Gesture(xpos, ypos, zpos, isLocked){
	if(!isLocked){
		xpos -= 30;
		ypos += 20;
		if(xpos > MAXXPOS) xpos = MAXXPOS;
		if(ypos > MAXYPOS) ypos = MAXYPOS;
		if(zpos > MAXZPOS) zpos = MAXZPOS;
		if(xpos < -MAXXPOS) xpos = -MAXXPOS;
		if(ypos < -MAXYPOS) ypos = -MAXYPOS;
		if(zpos < -MAXZPOS) zpos = -MAXZPOS;

		this.xpos = xpos/MAXXPOS;
		this.ypos = ypos/MAXYPOS;
		this.zpos = zpos/MAXZPOS;
	} else {
		this.xpos = 0;
		this.ypos = 0;
		this.zpos = 0;
	}
}

var gstate = new GestureState();

// Set up the controller:
Leap.loop({background: true}, function(frame){
	if(frame.hands.length > 0)
    {
        var hand = frame.hands[0];
        var position = hand.palmPosition;
        var velocity = hand.palmVelocity;
        var direction = hand.direction;
		var locked = false;
		//console.log(position);
		if(checkFist(hand)){
			if(gstate.numFists++ > 15){
				if(!gstate.isFisting){
					gstate.isFisting = true;
					gstate.locked = !gstate.locked;
				}
			}
		}
		else
		{
			gstate.numFists = 0;
			gstate.isFisting = false;
		}

		var gesture = new Gesture(position[0], -position[2], position[1], gstate.locked);
		console.log(gesture);


    }
	else
	{
		gstate = new GestureState();
	}
});


function getExtendedFingers(hand){
   var f = 0;
   for(var i=0;i<hand.fingers.length;i++){
      if(hand.fingers[i].extended){
         f++;
      }
   }
   return f;
}

function checkFist(hand){
   var sum = 0;
   for(var i=0;i<hand.fingers.length;i++){
      var finger = hand.fingers[i];
      var meta = finger.bones[0].direction();
      var proxi = finger.bones[1].direction();
      var inter = finger.bones[2].direction();
      var dMetaProxi = Leap.vec3.dot(meta,proxi);
      var dProxiInter = Leap.vec3.dot(proxi,inter);
      sum += dMetaProxi;
      sum += dProxiInter
   }
   sum = sum/10;

   if(sum<=minValue && getExtendedFingers(hand)==0){
       return true;
   }else{
       return false;
   }
}

/*********************************************************
* The rest of the code is here for visualizing the example. Feel
* free to remove it to experiment with the API value only
****************************************************/

// handle rad/deg UI

$('#output_rad, #output_deg').click(function(){
  $('#output_rad, #output_deg').toggle();
});

// Adds the rigged hand and playback plugins
// to a given controller, providing a cool demo.
visualizeHand = function(controller){
  // The leap-plugin file included above gives us a number of plugins out of the box
  // To use a plugins, we call `.use` on the controller with options for the plugin.
  // See js.leapmotion.com/plugins for more info

  controller.use('playback', {
    // This is a compressed JSON file of preprecorded frame data
    recording: 'finger-angle-43fps.json.lz',
    // How long, in ms, between repeating the recording.
    timeBetweenLoops: 1000,
    pauseOnHand: true
  }).on('riggedHand.meshAdded', function(handMesh, leapHand){
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
  camera.position.set(-8,8,20);
  camera.lookAt(new THREE.Vector3(0,0,0));
};
visualizeHand(Leap.loopController);
