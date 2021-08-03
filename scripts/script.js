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
    markersGroup = L.featureGroup(
      heritageLayer,
      museumLayer,
      treesLayer,
      touristAttractionLayer
    );
    initialLayer = L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11");
    getMapLayers(mymap);
    addControlHeader();

    window.addEventListener("DOMContentLoaded", () => {
      // SHOW PLACES OF INTEREST
      heritageLayer.on("click", function (ev) {
        addPOIMarkertoMap(mymap);
      });

      museumLayer.on("click", function (ev) {
        addPOIMarkertoMap(mymap);
      });

      touristAttractionLayer.on("click", function (ev) {
        addPOIMarkertoMap(mymap);
      });

      // TOGGLE BETWEEN SIDEBAR AND DIRECTIONS VIEW
      let directionsBtn = document.getElementById("directionsBtn");
      directionsBtn.addEventListener("click", toggleView);

      // TOGGLE SIDE PANEL DISPLAY OPEN AND CLOSE
      let sidePanelToggleBtn = document.querySelector(
        ".side-panel-toggle-btn "
      );
      sidePanelToggleBtn.addEventListener("click", function () {
        let sidePanel = document.querySelector(".side-panel-container");
        if (sidePanel.style.width !== "0rem") {
          sidePanel.style.width = "0rem";
          sidePanelToggleBtn.style.left = "0rem";

          sidePanelToggleBtn.innerHTML = `<button class="">
          <i class="fas fa-caret-right fa-2x"></i>
        </button>
        <span class="tooltip-sp-text">Expand Side Panel</span>`;
        } else {
          sidePanel.style.width = "50rem";
          sidePanelToggleBtn.style.left = "50rem";

          sidePanelToggleBtn.innerHTML = `<button class="">
          <i class="fas fa-caret-left fa-2x"></i>
        </button>
        <span class="tooltip-sp-text">Collapse Side Panel</span>`;
        }
      });

      //  FILTER ALL MARKERS BY KEYWORD USING CLICK BUTTON
      let searchByKeywordBtn = document.getElementById("keyWordBtn");

      searchByKeywordBtn.addEventListener("click", function () {
        resetMarkers(mymap);
        addControlHeader(mymap);
      });

      // FILTER ALL MARKERS BY KEYWORD USING ENTER BUTTON
      document
        .querySelector("#keyWord")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            resetMarkers(mymap);
            addControlHeader(mymap);
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
          //PUT CURRENT COORDINATES INTO DIRECTIONS ORIGIN INPUT
          let currentLocationInput = document.querySelector(
            "#mapbox-directions-origin-input"
          );
          currentLocationInput.dispatchEvent(
            new Event("input", { bubbles: true })
          );
          currentLocationInput.value = `${e.latlng.lng}, ${e.latlng.lat}`;
          currentLocationInput.focus();
        });
      });

      // BUTTON TO SEARCH FOR NEARBY FOOD

      let nearbyPOIBtn = document.getElementById("getNearbyPOIBtn");

      nearbyPOIBtn.addEventListener("click", async function () {
        let { lat, lng } = mymap.getCenter();
        let result = await search(lat, lng, "food");
        searchQueryLayer.clearLayers();
        let names = [];

        let searchResultDiv = document.querySelector(".search-query-div");
        let searchResults = document.createElement("div");
        searchResultDiv.innerHTML = "";

        for (let rec of result.response.groups[0].items) {
          // console.log(rec);

          let marker = L.marker(
            [rec.venue.location.lat, rec.venue.location.lng],
            {
              icon: L.mapbox.marker.icon({
                "marker-symbol": "restaurant",
                "marker-color": "#800080",
              }),
            }
          )
            .bindPopup(
              `<h1 style="text-align: center; min-width:100px; padding-top:1.3rem">${rec.venue.name}</h1>`
            )
            .addTo(searchQueryLayer);
          mouseOverOrOut(marker);
          names.push(rec.venue.name);
        }

        searchResultDiv.appendChild(searchResults);
        searchResults.innerHTML = "";
        for (let i of names) {
          let p = document.createElement("p");
          p.innerHTML = `${i}`;
          searchResults.appendChild(p);
        }

        names = [];
        addPOIMarkertoMap(mymap);
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

      // ADD TOURIST ATTRACTION DETAILS TO SIDEBAR ON CLICK
      touristAttractionLayer.on("click", function (e) {
        showSearchPanel();
        // variables for tourist attraction box
        let temp = document.createElement("div");

        temp.innerHTML = `${e.layer.feature.properties.description}`;
        let tds = temp.querySelectorAll("td");

        if (tds[7].innerText.slice(17).includes("Null")) {
          photo = "";
        } else photo = "https://www.visitsingapore" + tds[7].innerText.slice(17);
        let name = tds[13].innerText;
        let link = tds[27].innerText.includes("Null")
          ? "Unavailable"
          : tds[27].innerText;
        let latlng = `${e.latlng.lng}, ${e.latlng.lat}`;
        let description = tds[25].innerHTML;
        let address = `${tds[21].innerHTML}, Singapore ${tds[23].innerHTML}`;
        if (tds[21].innerHTML.includes("Null")) address = tds[23].innerHTML;
        if (tds[23].innerHTML.includes("Null")) address = tds[21].innerHTML;
        let openingHours = tds[31].innerHTML.includes("Null")
          ? "Unavailable"
          : tds[31].innerHTML;
        // create tourist attraction box
        let touristAttraction = $("<div />");
        touristAttraction.addClass("tourist-attraction-box");
        inputLatLng(e, touristAttraction, latlng);
        touristAttraction.html(
          link === "Unavailable"
            ? `
   <img src="${photo}" alt="Photo of ${name}">
    <h1>
         ${name}
    </h1>
    <div>
    <i class="fas fa-globe-americas fa-2x"></i>
    <span>${link}</span>
    </div>
    <div>
    <i class="fas fa-info-circle fa-2x"></i> ${description}
    </div>
    <div class="">
    <i class="fas fa-map-marker-alt fa-2x"></i> ${address}
    </div>
    <div> 
    <i id="attraction-icon-3" class="fas fa-clock fa-2x"></i> ${openingHours}
    </div>
    <div>
    <i class="fas fa-directions fa-2x"></i>Get Directions
    </div>`
            : `
    <img src="${photo}" alt="Photo of ${name}">
     <h1>
          ${name}
     </h1>
     <div>
     <a href="${link}" target="_blank" class="attraction-link"><i class="fas fa-globe-americas fa-2x"></i></a>
     <a href="${link}" target="_blank"><span>${link}</span></a>
     </div>
     <div>
     <i class="fas fa-info-circle fa-2x"></i> ${description}
     </div>
     <div class="">
     <i class="fas fa-map-marker-alt fa-2x"></i> ${address}
     </div>
     <div> 
     <i id="attraction-icon-3" class="fas fa-clock fa-2x"></i> ${openingHours}
     </div>
     <div class="directionsPopupBtn">
     <i class="fas fa-directions fa-2x"></i>Get Directions
     </div>`
        );

        searchQuery.innerHTML = "";
        searchQuery.insertAdjacentElement("beforeend", touristAttraction[0]);
      });
    });
  }
  init();
}

// INIIALISE MAP //
function initMap(initialLayer) {
  L.mapbox.accessToken =
    "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";
  let mymap = L.mapbox
    .map("map", null, {
      minZoom: 11,
    })
    .setView([1.3521, 103.8198], 13)
    .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));

  mymap.setMaxBounds(mymap.getBounds());

  // BUTTON TO TOGGLE FULL SCREEN
  mymap.addControl(new L.Control.Fullscreen());

  // WHEN CLICK ON MAP TOGGLE SIDE PANEL
  mymap.on("click", toggleView);

  return mymap;
}

////// MAIN THREAD ////////
main();

// TO TOGGLE BETWEEN DIRECTIONS CONTAINER AND SIDEBAR CONTAINER
function toggleView() {
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

function showDirectionsPanel() {
  let directionsContainerHidden = document.querySelector(
    ".directions-container-hidden"
  );
  let sidebarContainer = document.querySelector(".sidebar-container");
  if (
    directionsContainerHidden.classList.contains("directions-container-hidden")
  ) {
    directionsContainerHidden.classList.add("directions-container");
    sidebarContainer.classList.add("sidebar-container-hidden");
  }
}

function showSearchPanel() {
  let directionsContainerHidden = document.querySelector(
    ".directions-container-hidden"
  );
  let sidebarContainer = document.querySelector(".sidebar-container");
  if (sidebarContainer.classList.contains("sidebar-container")) {
    sidebarContainer.classList.remove("sidebar-container-hidden");
    directionsContainerHidden.classList.remove("directions-container");
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

// HELPER FUNCTIONS

async function resetMarkers(mymap) {
  heritageLayer.clearLayers();
  museumLayer.clearLayers();
  treesLayer.clearLayers();
  touristAttractionLayer.clearLayers();

  markersGroup.addLayer(heritageLayer);
  markersGroup.addLayer(museumLayer);
  markersGroup.addLayer(treesLayer);
  markersGroup.addLayer(touristAttractionLayer);

  await getTouristAttractionLayer(touristAttractionLayer);
  await getHeritageLayer(heritageLayer);
  await getMuseumLayer(museumLayer);
  await getTreesLayer(treesLayer);
  // UNCAUGHT PROMISE? Bounds are not valid
  mymap.fitBounds(markersGroup.getBounds());
  markersGroup.addTo(mymap);
}

function addControlHeader() {
  // STYLE CONTROL BOX
  let layerControl = document.querySelector(
    ".leaflet-control-layers-expanded .leaflet-control-layers-list"
  );

  let baseLayerControl = document.querySelector(".leaflet-control-layers-base");

  let overlaysControl = document.querySelector(
    ".leaflet-control-layers-overlays "
  );
  if (!document.querySelector(".test")) {
    baseLayerControl.insertAdjacentHTML(
      "afterbegin",
      "<div class='test'><h1>Base Maps</h1></div>"
    );

    overlaysControl.insertAdjacentHTML(
      "afterbegin",
      "<div class='test'><h1>Markers</h1></div>"
    );
  }
}

function inputLatLng(feature, container, latlng) {
  container.on("click", ".directionsPopupBtn", function () {
    let directionInput = document.querySelector(
      "#mapbox-directions-destination-input"
    );

    showDirectionsPanel();

    // https://stackoverflow.com/questions/35659430/how-do-i-programmatically-trigger-an-input-event-without-jquery
    directionInput.dispatchEvent(new Event("input", { bubbles: true }));
    directionInput.value = latlng;
    directionInput.focus();
    // console.log(directionInput.value);
  });
}

async function getNearbyPOI(container, latlng) {
  let [lng, lat] = latlng.split(",");
  container.on("click", ".nearbyPOIBtn", async function () {
    searchQueryLayer.clearLayers();
    let results = [];
    let names = [];

    let searchResultDiv = document.querySelector(".search-query-div");
    let searchResults = document.createElement("div");
    searchResultDiv.innerHTML = "";
    query = "food";
    let result = await search(lat, lng, query);
    console.log(result);

    results.push(result);
    for (let rec of result.response.groups[0].items) {
      // console.log(rec);

      let marker = L.marker([rec.venue.location.lat, rec.venue.location.lng], {
        icon: L.mapbox.marker.icon({
          "marker-symbol": "restaurant",
          "marker-color": "#800080",
        }),
      })
        .bindPopup(
          `<h1 style="text-align: center; min-width:100px; padding-top:1.3rem">${rec.venue.name}</h1>`
        )
        .addTo(searchQueryLayer);
      mouseOverOrOut(marker);
      names.push(rec.venue.name);
    }

    searchResultDiv.appendChild(searchResults);
    searchResults.innerHTML = "";
    for (let i of names) {
      let p = document.createElement("p");
      p.innerHTML = `${i}`;
      searchResults.appendChild(p);
    }

    names = [];
  });
}

function addPOIMarkertoMap(mymap) {
  let searchResultBox = document.querySelector(".search-query-div");
  if (searchResultBox.innerHTML !== "" || searchQueryLayer) {
    searchQueryLayer.addTo(mymap);
  }
}

function mouseOverOrOut(layer) {
  layer.on("mouseover", function () {
    this.openPopup();
  });

  layer.on("mouseout", function () {
    this.closePopup();
  });
}
