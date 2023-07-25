// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

  // Once we get a response, send the data.features object to the createFeatures function.
createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, time, magnitude and depth of the earthquake.

function onEachFeature(feature, layer) {
  layer.bindPopup(`<h3>Place: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}`);
}

 // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
      fillOpacity: 0.75,
      color: "black",
      weight: 0.5,
      fillColor: getColor(feature.geometry.coordinates[2]),
      // Setting our circle's radius to equal the output of our markerSize() function:
      // This will make our marker's size proportionate to its magnitude.
      radius:markerSize(feature.properties.mag)
    });
  }
});

// function determines marker size based on magnitude
function markerSize(mag) {
  return (mag) * 5;
}

// Send our earthquakes layer to the createMap function/
createMap(earthquakes);
}

//function determines color based on depth
function getColor(depth) {
  if (-10 <= depth && depth < 10)
  return "#aaef51";
  else if (10 <= depth && depth < 30)
  return "#e4ef51";
  else if (30 <= depth && depth < 50)
  return "#efc751";
  else if (50 <= depth && depth < 70)
  return "#efa051";
  else if (70 <= depth && depth < 90)
  return "#ef6051";
  else if (depth >= 90)  return "red";
}

//
function createMap(earthquakes) {

  // Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

  // Create a baseMaps object.
let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

  // Create an overlay object to hold our overlay.
let overlayMaps = {
    Earthquakes: earthquakes
};

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
let map = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 5,
    layers: [street,earthquakes]
});

//create legend for the map
var legend = L.control({position: "bottomright"});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10,10,30,50,70,90];
        labels = [];
        let legendInfo = "<h1>Depth</h1>";

    // loop through our depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);
}
