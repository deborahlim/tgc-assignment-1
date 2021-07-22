///// GLOBAL VARIABLES /////

let markers = [];
let results = [];
let names = [];
let searchInputBox = document.querySelector("#setBtn");
let searchBtn = document.querySelector("#searchBtn");
let selectedSearchInput = document.querySelector("#selectedSearch");
let searchResultDiv = document.querySelector(".searchResultDiv");
let searchResults = document.createElement("div");
let toggleTaxi = document.querySelector("#toggleTaxiBtn");

async function main() {
  function init() {
    let mymap = initMap();

    taxiResultLayer = L.markerClusterGroup();
    heritageLayer = L.mapbox.featureLayer();
    mrtStationsLayer = L.mapbox.featureLayer();
    getMapLayers(mymap);
    window.addEventListener("DOMContentLoaded", () => {
      toggleTaxi.addEventListener("click", () => {
        if (mymap.hasLayer(taxiResultLayer)) {
          mymap.removeLayer(taxiResultLayer);
        } else {
          mymap.addLayer(taxiResultLayer);
        }
      });
    });
  }
  init();
}

// INIIALISE MAP AND GET USER LOCATION /////////////
function initMap() {
  L.mapbox.accessToken =
    "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";
  var mymap = L.mapbox
    .map("map", null, {
      minZoom: 11,
    })
    .setView([1.3521, 103.8198], 12)
    .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));

  // Get user location
  // let userLocation = L.control
  //   .locate({
  //     flyTo: true,
  //     locateOptions: {
  //       maxZoom: 15,
  //     },
  //     position: "topright",
  //     strings: {
  //       title: "Click to toggle current location on/off",
  //       popup: `You are at `,
  //     },
  //   })
  //   .addTo(mymap);
  // getUserLocation.start();

  //// MAPBOX PLACES API ///////
  mymap.addControl(
    L.mapbox.geocoderControl("mapbox.places", {
      keepOpen: true,
    })
  );

  // Adds button to enable fullscreen toggle
  let toggleFullScreen = mymap.addControl(new L.Control.Fullscreen());
  ////////// MAP LAYERS ///////////

  // Add marker when user clicks on map
  // Create pop up for each marker and display the location
  // mymap.on("click", async function (ev) {
  //   // if there is no marker on the map, do the following
  //   let result = await search(ev.latlng.lat, ev.latlng.lng);
  //   results.push(result);
  //   let currentMarker = L.marker([ev.latlng.lat, ev.latlng.lng])
  //     .bindPopup(`${ev.latlng.lat}, ${ev.latlng.lng}`)
  //     .addTo(mymap);
  //   markers.push(currentMarker);

  //   // input lat lng of marker into search input box and display results
  //   selectedSearchInput.value = `${ev.latlng.lat}, ${ev.latlng.lng}`;
  //   searchBtn.addEventListener("click", () => {
  //     for (let rec of result.response.groups[0].items) {
  //       names.push(rec.venue.name);
  //     }

  //     searchResultDiv.appendChild(searchResults);
  //     searchResults.innerHTML = "";
  //     for (let i of names) {
  //       let p = document.createElement("p");
  //       p.innerHTML = `${i}`;
  //       p.className = "searchResult";
  //       searchResults.appendChild(p);
  //     }

  //     names = [];
  //   });
  // });

  return mymap;
}

// Add GeoJSON data to the taxi cluster group
async function getTaxiLayer() {
  let response = await updateTaxiAvail();
  console.log(response.data);
  taxiResultLayer.clearLayers();

  L.geoJSON(response.data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: L.mapbox.marker.icon({
          "marker-symbol": "car",
          "marker-color": "#F1ee1e",
        }),
      }).addTo(taxiResultLayer);
    },
    //setTimeout(getTaxiLayer, 60000);
  });
}
// Add GeoJSON data to the heritage feature group
async function getHeritageLayer() {
  let response = await getData("data/historic-sites-geojson.geojson");

  let heritage = L.geoJSON(response.data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: L.mapbox.marker.icon({
          "marker-symbol": "town-hall",
          "marker-color": "0044FF",
        }),
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.Description);
      let e = document.createElement("div");
      e.innerHTML = feature.properties.Description;
      let tds = e.querySelectorAll("td");
      let name = tds[4].innerHTML;
      let description = tds[6].innerHTML;
      let randomColor = Math.floor(Math.random() * 16777215).toString(16);
      layer.bindPopup(`<div style="color: #${randomColor}">
                  <p style="font-weight:600">
                       Name: ${name}
                  </p>
                  <p>
                       Description: ${description}
                  </p>
               </div>`);
    },

    // pointToLayer: function (geoJsonPoint, latlng) {
    //   return L.marker(latlng).bindPopup(`${latlng}`);
    // },
  }).addTo(heritageLayer);
}

async function getMrtStations() {
  let response = await getData("data/lta-mrt-station-exit-geojson.geojson");
  console.log(response.data);
  let mrt = L.geoJSON(response.data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: L.mapbox.marker.icon({
          "marker-symbol": "town-hall",
          "marker-color": "0044FF",
        }),
      });
    },
    onEachFeature: function (feature, layer) {
      console.log(feature);
      layer.bindPopup(feature.properties.Description);
      let e = document.createElement("div");
      e.innerHTML = feature.properties.Description;
      // let tds = e.querySelectorAll("td");
      // let name = tds[4].innerHTML;
      // let description = tds[6].innerHTML;
      // let randomColor = Math.floor(Math.random() * 16777215).toString(16);
      // layer.bindPopup(`<div style="color: #${randomColor}">
      //             <p style="font-weight:600">
      //                  Name: ${name}
      //             </p>
      //             <p>
      //                  Description: ${description}
      //             </p>
      //          </div>`);
    },

    // pointToLayer: function (geoJsonPoint, latlng) {
    //   return L.marker(latlng).bindPopup(`${latlng}`);
    // },
  }).addTo(mrtStationsLayer);
}

function getDirections(mymap) {
  // move the attribution control out of the way
  mymap.attributionControl.setPosition("bottomright");

  //create the initial directions object, from which the layer
  //and inputs will pull data.
  directions = L.mapbox.directions();
  L.mapbox.accessToken =
    "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";
  var directionsLayer = L.mapbox.directions.layer(directions).addTo(mymap);

  var directionsInputControl = L.mapbox.directions
    .inputControl("inputs", directions)
    .addTo(mymap);

  var directionsErrorsControl = L.mapbox.directions
    .errorsControl("errors", directions)
    .addTo(mymap);

  var directionsRoutesControl = L.mapbox.directions
    .routesControl("routes", directions)
    .addTo(mymap);

  var directionsInstructionsControl = L.mapbox.directions
    .instructionsControl("instructions", directions)
    .addTo(mymap);
}

// Render layers on mymap
async function getMapLayers(mymap) {
  // Taxi Layer
  getTaxiLayer(taxiResultLayer);
  getDirections(mymap);
  getHeritageLayer(heritageLayer);
  getMrtStations();

  let baseLayers = {
    "Street View": L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"),
    "Outdoor View": L.mapbox.styleLayer("mapbox://styles/mapbox/outdoors-v11"),
    "Satellite View": L.mapbox.styleLayer(
      "mapbox://styles/mapbox/satellite-v9"
    ),
  };
  let overlays = {
    Taxis: taxiResultLayer,
    Heritage: heritageLayer,
    "MRT Stations": mrtStationsLayer,
  };
  L.control.layers(baseLayers, overlays).addTo(mymap);
}

////// MAIN THREAD ////////
main();
