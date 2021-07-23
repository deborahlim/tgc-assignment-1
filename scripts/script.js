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
let searchQuery = document.getElementById("searchQuery");
let userLocationBtn = document.getElementById("userLocation");
async function main() {
  function init() {
    let mymap = initMap();

    taxiResultLayer = L.markerClusterGroup();
    heritageLayer = L.mapbox.featureLayer();
    mrtStationsLayer = L.mapbox.featureLayer();
    searchQueryLayer = L.mapbox.featureLayer();
    userLocationLayer = L.mapbox.featureLayer();
    getMapLayers(mymap);

    // External button to toggle Taxi Availability
    window.addEventListener("DOMContentLoaded", () => {
      toggleTaxi.addEventListener("click", () => {
        if (mymap.hasLayer(taxiResultLayer)) {
          mymap.removeLayer(taxiResultLayer);
        } else {
          mymap.addLayer(taxiResultLayer);
        }
      });

      //// MAPBOX PLACES API ///////
      mymap.addControl(
        L.mapbox
          .geocoderControl("mapbox.places", {
            position: "topright",
            keepOpen: false,
            autocomplete: false,
            country: "singapore",
            placeholder: "Search for places in Singapore",
            queryOptions: {
              // query: "chicken",
              limit: "10",
            },
          })
          .on("found", function (res) {
            searchQuery.innerHTML = "";
            res.results.features.forEach((el) => {
              temp = JSON.stringify(el.place_name);
              // ADD DESCRIPTION IN SIDEBAR
              let p = document.createElement("p");
              p.innerHTML = `<h1>Place: ${temp}</h1><br>`;
              searchQuery.insertAdjacentElement("beforeend", p);
              console.log(p.innerHTML);
              console.log(el);
              // ADD MARKERS
              L.geoJSON(el, {
                pointToLayer: function (geoJsonPoint, latlng) {
                  return L.marker(latlng, {
                    icon: L.mapbox.marker.icon({
                      "marker-symbol": "car",
                      "marker-color": "#F1ee1e",
                    }),
                  })
                    .bindPopup(`${temp}`)
                    .addTo(searchQueryLayer);
                },
              }).addTo(mymap);
              console.log(searchQueryLayer);
            });
          })
      );

      // Get user location
      userLocationBtn.addEventListener("click", function (e) {
        if (!navigator.geolocation) {
          userLocationBtn.textContent = "Please Enable Location";
        } else {
          e.preventDefault();
          mymap.locate();
        }

        mymap.on("locationfound", function (e) {
          mymap.fitBounds(e.bounds);

          userLocationLayer
            .setGeoJSON({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [e.latlng.lng, e.latlng.lat],
              },
              properties: {
                title: "Here I am!",
                "marker-size": "large",
                "marker-color": "#000000",
                "marker-symbol": "viewpoint",
              },
            })
            .addTo(mymap);
        });
      });
    });
  }
  init();
}

// INIIALISE MAP /////////////
function initMap() {
  L.mapbox.accessToken =
    "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";
  var mymap = L.mapbox
    .map("map", null, {
      minZoom: 11,
    })
    .setView([1.3521, 103.8198], 12)
    .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));

  // Adds button to enable fullscreen toggle
  let toggleFullScreen = mymap.addControl(new L.Control.Fullscreen());

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
    // To get updated taxi data every minute
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
      // console.log(feature);
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
    //Search: searchQueryLayer,
  };
  L.control.layers(baseLayers, overlays).addTo(mymap);
}

////// MAIN THREAD ////////
main();
