var $       = require('dominus');
var apiKey  = 'AIzaSyCQe2_MaDcjolbMp0QWQOjW-sMbE0bc7ac';

var content = '' +
  '<div id="map-content">' +
    '<h1>' +
      'All In 1 Guesthouse' +
    '</h1>' +
  '</div>';

function init() {
  console.log('init gmap api');
  window.allin1.gmap = initGmap;
  var url = 'http://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true' +
      '&key=' + apiKey +
      '&callback=window.allin1.gmap';
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.body.appendChild(script)
};

function initGmap() {
  console.log('show map');

  var location = new google.maps.LatLng(18.783509, 98.991796);

  var mapOptions = {
    zoom: 16,
    center: location,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
  };

  var map = new google.maps.Map($('#allin1Map')[0], mapOptions);

  // marker
  var marker = new google.maps.Marker({
      position: location,
      map: map,
      title: "Allin1 Guesthouse",
      place: {
        location: {lat: 18.783509, lng: 98.991796},
        query: 'allin1, guesthouse, chiang mai, thailand'

      },
      attribution: {
        source: 'Google Maps JavaScript API',
        webUrl: 'https://developers.google.com/maps/',
      }
    });

  // description
  var descripion = new google.maps.InfoWindow({
    content: content,
  });

  google.maps.event.addListener(marker, 'click', function() {
    descripion.open(map, marker);
  });

  descripion.open(map, marker);
};

module.exports = {
  init: init,
};
