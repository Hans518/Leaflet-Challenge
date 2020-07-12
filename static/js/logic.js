// Creating map object
var myMap = L.map("map", {
    center: [43.223, -133.7724],
    zoom: 4
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  var earthquakes = new L.LayerGroup();

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
    earthquakes.addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    //Adding legend to the map
    legend.addTo(myMap);

});