// 1. Map object.
var mymap = L.map('map', {
    center: [37.8, -96],
    zoom: 4,
    maxZoom: 9,
    minZoom: 3,
    detectRetina: true // detect whether the sceen is high resolution or not.
});

// 2. Basemap
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// 3. Create airport var.
var airports = null;

// 4. Set colors
var colors = chroma.scale('RdBu').mode('lch').colors(2);

// 5. Append Style classes
for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// 6. Add airport data, creat icons
airports= L.geoJson.ajax("assets/airports.geojson", {
      // assign a function to the onEachFeature parameter of the cellTowers object.
      // Then each (point) feature will bind a popup window.
      // The content of the popup window is the value of `feature.properties.company`
      onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.AIRPT_NAME);
          return feature.properties.AIRPT_NAME;
      },
      pointToLayer: function (feature, latlng) {
          var id = 0;
          if(feature.properties.CNTL_TWR == "Y") {id = 0;}
          else {id = 1}
          return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
      },
      attribution: 'airports.geojson contains all the airports in the United States, from https://catalog.data.gov/dataset/usgs-small-scale-dataset-airports-of-the-united-states-201207-shapefile'
  }).addTo(mymap);

  // 7. Add colors for states
  colors = chroma.scale('BuPu').mode('lch').colors(5);

  function setColor(density) {
      var id = 0;
      if (density > 40) { id = 4; }
      else if (density > 24 && density <= 40) { id = 3; }
      else if (density > 12 && density <= 24) { id = 2; }
      else if (density > 2 &&  density <= 12) { id = 1; }
      else  { id = 0; }
      return colors[id];
  }

  // 8. Set style
  function style(feature) {
      return {
          fillColor: setColor(feature.properties.count),
          fillOpacity: 0.4,
          weight: 2,
          opacity: 1,
          color: '#b4b4b4',
          dashArray: '4'
      };
  }

// 9. Add states polygons
  var states = null;
  states = L.geoJson.ajax("assets/us-states.geojson", {
      style: style
  }).addTo(mymap);

// 10. Create Leaflet Control Object for Legend
  var legend = L.control({position: 'topright'});

// 11. Assign legend items
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Number of Airports by State</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 41+ </p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 25-40 </p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 13-25 </p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 3-12 </p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-2 </p>';
    div.innerHTML += '<hr><b>Control Tower?<b><br />';
    div.innerHTML += '<i class="fa fa-signal marker-color-1"></i><p>Control Tower</p>';
    div.innerHTML += '<i class="fa fa-signal marker-color-2"></i><p>No Control Tower</p>';

    return div;
};

// 12. Add legend to map
legend.addTo(mymap);

// 13. Add scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
