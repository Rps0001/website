$(document).ready(function(){
    $('.datepicker').datepicker({
        autoclose: true,
        format:  "yyyy-mm-dd",
    });
});

var markers = [];
var markerLocator;
function initMap() {
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        center: new google.maps.LatLng(34.299, 66.5175319),
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        styles:mapStyle
    };
    map = new google.maps.Map(document.getElementById("register-map"), mapOptions);
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
    });
    $.ajax({
        type:'get',
        url:'/registered/users',
        success:function(locations){
            for (var i = 0; i < locations.length; i++) {
                var location= locations[i].location.split(',');
                myLatLng = new google.maps.LatLng(location[0] , location[1]);
                var marker = new google.maps.Marker({
                    map: map,
                    position: myLatLng,
                    optimized:false,
                    url:locations[i].html_url,
                    title:locations[i].nickname,
                    icon: {
                        url: locations[i].avatar, // url
                        scaledSize: new google.maps.Size(50, 50), // scaled size
                        origin: new google.maps.Point(0,0), // origin
                        anchor: new google.maps.Point(10, 0) // anchor
                    }
                });
                marker.setMap(map);
                markers.push(marker);
                google.maps.event.addListener(marker, 'click', function() {
                    window.open(this.url, '_blank');
                });
                bounds.extend(markers[i].getPosition());
            } // end of for loop
            map.fitBounds(bounds);
            addMarkerCluster();
        }
    });
    getLocation(map);
}


function addMarkerCluster(){
    var markerCluster = new MarkerClusterer(map, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        maxZoom: 18
    });
}
function getLocation(map){
    var input = document.getElementById('search-location');
    var searchBox = new google.maps.places.SearchBox(input);
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }
            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
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

function placeMarker(location) {
    if (markerLocator) {
        markerLocator.setPosition(location);
    } else {
        markerLocator = new google.maps.Marker({
            map: map,
            position: location,
            icon: {
                url: '../../images/marker.png', // url
                scaledSize: new google.maps.Size(50, 50), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(10, 0) // anchor
            }
        });
    }
    // setting lat and lng on their specific inputs
    $('#location').val(location.lat() + "," + location.lng());
}
