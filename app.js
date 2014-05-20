var Flatsheet = require('flatsheet');
var Handlebars = require('handlebars');
var eve = require('dom-events');
var elClass = require('element-class');
var Leaflet = require('leaflet');
require('leaflet-providers');
var fs = require('fs');

var fastClick = require('fastclick');
fastClick(document.body);

var page = document.getElementById('page');
var flatsheet = new Flatsheet();

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

/* pull in art locations from app.flatsheet.io */
flatsheet.sheet('1lbocmzawdbe2zmz8ges9a', getRows);

/* callback for request to flatsheet */
function getRows (error, response) {
  var rows = response.rows;
  var l = rows.length;

  for (var i=0; i<l; i++){
    addMarker(rows[i]);
  }
}

/* add a marker to map from json data */
function addMarker (row) {
  var options = { maxWidth: 600, maxHeight: 300 };
  var latlng = { lat: row['latitude'], lng: row['longitude'] };
  var html = template(row);

  var marker = L.marker(latlng);
  marker.addTo(map);

  marker.on('click', function(e) {
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = html;
    page.appendChild(modal);
    var inner = document.querySelector('.location-info');

    if (window.innerWidth < 700) inner.style.height = window.innerHeight - 120 + 'px';
    else inner.style.height = window.innerHeight - 40 + 'px';

    var close = document.getElementById('close-modal');
    eve.on(close, 'click', function (e) {
      page.removeChild(modal);
      e.preventDefault();
    })
  });
}

/* create infobox toggle for mobile */
var infobox = document.getElementById('infobox');
var toggle = document.getElementById('infobox-toggle');

eve.on(toggle, 'click', function (e) {
  if (elClass(toggle).has('active')) {
    elClass(toggle).remove('active');
    elClass(infobox).remove('active');
    toggle.innerHTML = '+ open';
  } else {
    elClass(toggle).add('active');
    elClass(infobox).add('active');
    toggle.innerHTML = 'x close';
  }
  e.preventDefault();
});
