
  /********************************************************
  * This is the actual example part where we call pinchStrength
  *****************************************************/
  var output_rad = document.getElementById('output_rad'),
    output_deg = document.getElementById('output_deg'),
    progress = document.getElementById('progress');

  window.TO_DEG = 180 / Math.PI;

  // Set up the controller:
  Leap.loop({background: true}, {
    hand: function(hand){
    }
  });


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
    // boneColors: function (boneMesh, leapHand){
    //   if ((boneMesh.name.indexOf('Finger_') == 0) ) {
    //     if ((boneMesh.name.indexOf('Finger_10') == 0) ||
    //         (boneMesh.name.indexOf('Finger_20') == 0)
    //         ) {
    //       return {
    //         hue: 0.564,
    //         saturation: 1,
    //         lightness: 0.5
    //       }
    //     }
    //   }
    // }
    });

    var camera = controller.plugins.riggedHand.camera;
    camera.position.set(-8,8,20);
    camera.lookAt(new THREE.Vector3(0,0,0));
  };
  visualizeHand(Leap.loopController);