async function main() {
  function init() {
    let mymap = initMap();
    let userLocationBtn = document.getElementById("userLocation");
    taxiResultLayer = L.markerClusterGroup();
    heritageLayer = L.mapbox.featureLayer();
    treesLayer = L.mapbox.featureLayer();
    museumLayer = L.mapbox.featureLayer();
    mrtStationsLayer = L.mapbox.featureLayer();
    searchQueryLayer = L.mapbox.featureLayer();
    userLocationLayer = L.mapbox.featureLayer();
    touristAttractionLayer = L.mapbox.featureLayer();

    getMapLayers(mymap);

    window.addEventListener("DOMContentLoaded", () => {
      //  BUTTON TO FILTER HERITAGE MARKERS BY KEYWORD
      let searchByKeywordBtn = document.getElementById("keyWordBtn");
      searchByKeywordBtn.addEventListener("click", function (e) {
        heritageLayer.clearLayers();
        getHeritageLayer(heritageLayer);
      });

      // FILTER HERITAGE MARKERS BY PRESSING ENTER BUTTON
      document
        .querySelector("#keyWord")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            // code for enter
            heritageLayer.clearLayers();
            getHeritageLayer(heritageLayer);
          }
        });
      // BUTTON TO GET USER LOCATION
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

      // BUTTON TO TOGGLE TAXI AVAILABILITY LAYER
      let toggleTaxi = document.getElementById("toggleTaxiBtn");
      toggleTaxi.addEventListener("click", () => {
        if (mymap.hasLayer(taxiResultLayer)) {
          mymap.removeLayer(taxiResultLayer);
        } else {
          mymap.addLayer(taxiResultLayer);
        }
      });
      // GET TAXI LOCATION USING MAPBOX API REVERSE GEOCODING
      taxiResultLayer.on("click", function (e) {
        let { lat, lng } = e.latlng;
        let geocoder = L.mapbox.geocoder("mapbox.places");
        let func = (err, data) => {
          let t = data.features[0].place_name;
          taxiResultLayer.bindPopup(`<h1 style="text-align: center">${t}</h1>`);
        };
        geocoder.reverseQuery([lng, lat], func);
      });

      //// ADD SEARCH BOX USING MAPBOX PLACES API //////
      mymap.addControl(
        L.mapbox
          .geocoderControl("mapbox.places", {
            position: "topright",
            keepOpen: false,
            accessToken:
              "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q",
            queryOptions: {
              autocomplete: false,
              country: "sg",
              limit: 10,
            },
          })
          .on("found", function (res) {
            searchQueryLayer.clearLayers();
            searchQuery.innerHTML = "";
            res.results.features.forEach((el) => {
              // console.log(el);
              placeName = JSON.stringify(el.text).slice(1, -1);
              // console.log(placeName);
              // ADD DESCRIPTION IN SIDEBAR
              let content = document.createElement("div");
              let searchQuery = document.getElementById("searchQuery");
              content.className = "searchQueryBox";
              content.innerHTML = `<a class="searchQueryLink" href="https://foursquare.com/v/${el.properties.foursquare}/photos"><h1>${el.text}</h1>
              </a><p>Category: ${el.properties.category}</p><p>${el.properties.address}, ${el.context[2].text}, 
              Singapore ${el.context[0].text} </p> `;
              searchQuery.insertAdjacentElement("beforeend", content);
              // console.log(content.innerHTML);
              console.log(el);
              // ADD MARKERS
              L.geoJSON(el, {
                pointToLayer: function (geoJsonPoint, latlng) {
                  return L.marker(latlng, {
                    icon: L.mapbox.marker.icon({
                      // "marker-symbol": el.properties.maki,
                      "marker-symbol": "restaurant",
                      "marker-color": "#800080",
                    }),
                  })
                    .bindPopup(`<h1>${el.text}</h1>`)
                    .addTo(searchQueryLayer);
                },
              }).addTo(mymap);
            });
          })
      );

      // SO THAT PREVIOUS SEARCH MARKERS ARE REMOVED AND NEW SEARCH MARKERS ARE ADDED
      if (mymap.hasLayer(searchQueryLayer)) {
        mymap.removeLayer(searchQueryLayer);
      } else {
        mymap.addLayer(searchQueryLayer);
      }
    });
  }
  init();
}

// INIIALISE MAP //
function initMap() {
  L.mapbox.accessToken =
    "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";
  let mymap = L.mapbox
    .map("map", null, {
      minZoom: 11,
    })
    .setView([1.3521, 103.8198], 11)
    .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));

  mymap.setMaxBounds(mymap.getBounds());

  // BUTTON TO TOGGLE FULL SCREEN
  mymap.addControl(new L.Control.Fullscreen());

  // Add marker when user clicks on map
  // Create pop up for each marker and display the location
  // mymap.on("click", async function (ev) {
  //   let markers = [];
  //   let results = [];
  //   let names = [];
  //   let searchBtn = document.getElementById("searchBtn");
  //   let searchResultDiv = document.querySelector(".searchResultDiv");
  //   let searchResults = document.createElement("div");
  //   let selectedSearchInput = document.getElementById("selectedSearch");

  //   // if there is no marker on the map, do the following
  //   let result = await search(ev.latlng.lat, ev.latlng.lng);
  //   console.log(result);
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

  // WHEN CLICK ON MAP TOGGLE SIDE PANEL
  mymap.on("click", toggleSidePanel);

  return mymap;
}

// WHEN CLICK ON DIRECTIONS BUTTON SIDE PANEL
let directionsBtn = document.getElementById("directionsBtn");
directionsBtn.addEventListener("click", toggleSidePanel);

// TOGGLE SIDEBAR VIEW AND DIRECTIONS VIEW

////// MAIN THREAD ////////
main();

// TO TOGGLE BETWEEN DIRECTIONS CONTAINER AND SIDEBAR CONTAINER
function toggleSidePanel() {
  let directionsContainerHidden = document.querySelector(
    ".directions-container-hidden"
  );
  let sidebarContainer = document.querySelector(".sidebar-container");

  if (
    directionsContainerHidden.classList.contains("directions-container-hidden")
  )
    if (directionsContainerHidden.classList.contains("directions-container")) {
      directionsContainerHidden.classList.remove("directions-container");
      sidebarContainer.classList.remove("sidebar-container-hidden");
    } else {
      directionsContainerHidden.classList.add("directions-container");
      sidebarContainer.classList.add("sidebar-container-hidden");
    }
}

// https://gist.github.com/Chak10/dc24c61c9bf2f651cb6d290eeef864c1
function randDarkColor() {
  var lum = -0.25;
  var hex = String(
    "#" + Math.random().toString(16).slice(2, 8).toUpperCase()
  ).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  var rgb = "#",
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }
  return rgb;
}
