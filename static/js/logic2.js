// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  //createFeatures(data.features);
 return(earthquakeData)


function createFeatures(earthquakeData) {

    d3.json(earthquakeUrl, function(earthquakeData){
        function markerSize(mag) {
            if (mag === 0){
                return 1;
            }
            return mag * 3;
        }
    
        function markerStyle(feature){
            return {
                opacity: 1,
                fillOpacity: 0.9,
                fillColor: chooseColor(feature.properties.mag),
                color: "000000",
                radius: markerSize(feature.properties.mag),
                stroke: true,
                weight: 0.9
            };
        }
    
      // Function that will determine the color of a neighborhood based on the borough it belongs to
        function chooseColor(mag) {
            switch (true) {
            case mag > 5:
            return "#A52105";
            case mag > 4:
            return "#E87F09";
            case mag > 3:
            return "#E8DB09";
            case mag > 2:
            return "#C0E809";    
            case mag > 1:
            return "#79E809";
            default : 
                return "#31E809"
            }
        }
    
        L.geoJSON(earthquakeData, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng);
            },
            style: markerStyle,
            onEachFeature: function(feature, layer) {
                layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p><b>Magnitude: </b>" +  feature.properties.mag  + "</p>" + "<p><b>Date: </b>" +   new Date(feature.properties.time) + "</p>");
            }
        }).addTo(earthquakes)

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

});
