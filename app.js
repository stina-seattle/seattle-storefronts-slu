var Handlebars = require('handlebars');
var Leaflet = require('leaflet');
require('leaflet-providers');
var fs = require('fs');

/* pull in geojson of art locations */
var art = JSON.parse(fs.readFileSync('art.json'));

/* pull in template for showing info about a location */
var template = Handlebars.compile(fs.readFileSync('info-template.html'));

/* set image path */
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

/* create map */
var map = L.map('map');
 
/* set map view to south lake union area */
map.setView([47.62240724816091, -122.33692646026611], 16);

/* use the pretty watercolor tileset from stamen */
var layer = L.tileLayer.provider('Stamen.Watercolor').addTo(map);

/* add art geojson to map */
var markers = L.geoJson(art, {
    onEachFeature: onEachFeature
}).addTo(map);

function onEachFeature(feature, layer) {
	var options = { maxWidth: 600, maxHeight: 300 }
  if (feature.properties) layer.bindPopup(template(feature.properties), options);
}

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.lng + ', ' + e.latlng.lat)
        .openOn(map);
}

map.on('click', onMapClick);