var map;

var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });

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