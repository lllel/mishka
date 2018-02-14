function initMap() {
  var uluru = {lat: 59.93876222, lng: 30.32302737};
  var map = new google.maps.Map(document.querySelector('#map'), {
    zoom: 17,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map,
    icon: './img/icon-map-pin.svg'
  });
}
