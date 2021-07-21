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

// Add Mapbox tile layers variables
// let mapboxUrl =
//   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
// let attribution =
//   'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
// let accessToken =
//   "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";

async function main() {
  function init() {
    let mymap = initMap();

    taxiResultLayer = L.markerClusterGroup();

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
  // let streets = L.tileLayer(mapboxUrl, {
  //   attribution,
  //   minZoom: 12,
  //   id: "mapbox/streets-v11",
  //   tileSize: 512,
  //   zoomOffset: -1,
  //   accessToken,
  // });

  // let mymap = L.map("map", {
  //   center: [1.3521, 103.8198],
  //   zoom: 13,
  //   layers: [streets],
  // });
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

////// BASE LAYERS //////

// Add GeoJSON data to the taxi cluster group
async function getTaxiLayer() {
  let response = await updateTaxiAvail();
  console.log(response.data);
  taxiResultLayer.clearLayers();

  L.geoJSON(response.data, {
    // onEachFeature: function (feature, layer) {
    //   return L.marker(feature.geometry.coordinates).bindPopup("hi");
    // },
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.marker(latlng).bindPopup(`${latlng}`);
    },
  }).addTo(taxiResultLayer);
  // results.setStyle({ color: red });

  //setTimeout(getTaxiLayer, 60000);
}

// Render layers on mymap
async function getMapLayers(mymap) {
  // Taxi Layer
  getTaxiLayer(taxiResultLayer);
  getDirections(mymap);
  //2 Objects storing map base and overlay layers
  // let streets = L.tileLayer(mapboxUrl, {
  //   attribution,
  //   maxZoom: 18,
  //   minZoom: 12,
  //   id: "mapbox/streets-v11",
  //   tileSize: 512,
  //   zoomOffset: -1,
  //   accessToken,
  // });
  // let outdoors = L.tileLayer(mapboxUrl, {
  //   id: "mapbox/outdoors-v11",
  //   tileSize: 512,
  //   zoomOffset: -1,
  //   attribution,
  //   accessToken,
  //   minZoom: 12,
  // });
  // let satellite = L.tileLayer(mapboxUrl, {
  //   id: "mapbox/satellite-v9",
  //   tileSize: 512,
  //   zoomOffset: -1,
  //   attribution,
  //   accessToken,
  //   minZoom: 12,
  // });

  let baseLayers = {
    "Street View": L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"),
    "Outdoor View": L.mapbox.styleLayer("mapbox://styles/mapbox/outdoors-v11"),
    "Satellite View": L.mapbox.styleLayer(
      "mapbox://styles/mapbox/satellite-v9"
    ),
  };
  let overlays = {
    Taxis: taxiResultLayer,
  };
  L.control.layers(baseLayers, overlays).addTo(mymap);
}

function getDirections(mymap) {
  mymap.attributionControl.setPosition("bottomleft");
  directions = L.mapbox.directions();
  L.mapbox.accessToken =
    "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";
  // move the attribution control out of the way

  //create the initial directions object, from which the layer
  //and inputs will pull data.

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

////// MAIN THREAD ////////
main();
