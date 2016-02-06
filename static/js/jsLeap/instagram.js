var urls = []

function search_by_geo(lat, lon, callback) {

  var searchURL = "https://api.instagram.com/v1/media/search";

  $.ajax({
    url: searchURL,
    type: "GET",
    dataType: "jsonp",
    cache: false,
    data: {
      client_id: "22aaafad8e8447cf883c2cbb55663de5",
      lat: lat,
      lng: lon,
      distance: 10
    },
    success: function(data) {
      urls = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        urls.push({
          "image": obj.images.standard_resolution.url,
          "source": obj.link
        });
      }
      populate_carousel(urls);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      showError("ERROR loadGeoLocation: " + textStatus);
    }
  });
}

function populate_carousel() {
  for (var i = 0; i < urls.length; i++) {
    $('<div class="item"><img src="' + urls[i].image + '"><div class="carousel-caption"></div>   </div>').appendTo('.carousel-inner');
    $('<li data-target="#myCarousel" data-slide-to="' + i + '"></li>').appendTo('.carousel-indicators')

  }
  $('.item').first().addClass('active');
  $('.carousel-indicators > li').first().addClass('active');
  $('#myCarousel').carousel();
}