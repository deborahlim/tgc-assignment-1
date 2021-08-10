// HELPER FUNCTIONS

// OPEN POP OP ON MOUSE OVER AND CLOSE ON MOUSE OUT
function mouseOverOrOut(layer) {
  layer.on("mouseover", function () {
    this.openPopup();
  });

  layer.on("mouseout", function () {
    this.closePopup();
  });
}

// TOGGLE SIDE PANEL OPEN AND CLOSE
function toggleSidePanel(sidePanelToggleBtn) {
  let desiredWidth = getDesiredSidePanelWidth();
  let sidePanel = document.querySelector(".side-panel-container");

  console.log(window.innerWidth);
  if (sidePanel.style.width !== "0%") {
    sidePanel.style.width = "0%";
    sidePanelToggleBtn.style.left = "0%";

    sidePanelToggleBtn.innerHTML = `<button class="">
        <i class="fas fa-caret-right "></i>
      </button>
      <span class="tooltip-sp-text">Expand Side Panel</span>`;
  } else {
    sidePanel.style.width = desiredWidth;
    sidePanelToggleBtn.style.left = desiredWidth;

    sidePanelToggleBtn.innerHTML = `<button class="">
        <i class="fas fa-caret-left"></i>
      </button>
      <span class="tooltip-sp-text">Collapse Side Panel</span>`;
  }
}

function openSidePanel(sidePanelToggleBtn) {
  let desiredWidth = getDesiredSidePanelWidth();
  let sidePanel = document.querySelector(".side-panel-container");
  sidePanel.style.width = desiredWidth;
  sidePanelToggleBtn.style.left = desiredWidth;

  sidePanelToggleBtn.innerHTML = `<button class="">
        <i class="fas fa-caret-left"></i>
      </button>
      <span class="tooltip-sp-text">Collapse Side Panel</span>`;
}

// DIFFERENT SIDE PANEL WIDTH FOR DIFFERENT DEVICE SIZES
function getDesiredSidePanelWidth() {
  let desiredWidth = "25%";
  if (window.innerWidth < "376") {
    desiredWidth = "85%";
  } else if (window.innerWidth < "541") {
    desiredWidth = "90%";
  } else if (window.innerWidth < "769") {
    desiredWidth = "55%";
  } else if (window.innerWidth < "1025") {
    desiredWidth = "60%";
  } else if (window.innerWidth < "1367") {
    desiredWidth = "35%";
  } else {
    desiredWidth = "25%";
  }
  return desiredWidth;
}

// TO TOGGLE BETWEEN DIRECTIONS CONTAINER AND SIDEBAR CONTAINER
function toggleView() {
  let directionsContainerHidden = document.querySelector(
    ".directions-container-hidden"
  );
  let sidebarContainer = document.querySelector(".sidebar-container");
  let directionsBtn = document.getElementById("directionsBtn");
  if (
    directionsContainerHidden.classList.contains("directions-container-hidden")
  )
    if (directionsContainerHidden.classList.contains("directions-container")) {
      directionsContainerHidden.classList.remove("directions-container");
      sidebarContainer.classList.remove("sidebar-container-hidden");
      directionsBtn.innerHTML = `<i class="fas fa-directions fa-2x" id="directionsBtn" aria-hidden="true"></i>
      <span class="tooltip-text">Get Directions</span>`;
    } else {
      directionsContainerHidden.classList.add("directions-container");
      sidebarContainer.classList.add("sidebar-container-hidden");
      directionsBtn.innerHTML = `<i class="fas fa-search-location fa-2x" id="directionsBtn" aria-hidden="true"></i>
      <span class="tooltip-text">Search</span>`;
    }
}

// SHOW DIRECTIONS PANEL
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

// SHOW SEARCH PANEL
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
// RANDOM DARK COLOUR
//
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

// RESET MARKERS ON MAP MARKER SEARCH AND FIT BOUNDS OF MARKERS

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
  // check if keyword is valid
  let bounds = markersGroup.getBounds();
  if (bounds.isValid()) {
    mymap.fitBounds(markersGroup.getBounds());
    markersGroup.addTo(mymap);
  }
}

// MODIFY LEAFLET LAYER CONTROL BOX
function addControlHeader() {
  // STYLE CONTROL BOX
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

// TO INPUT LATLNG WHEN USER CLICK DIRECTIONS BUTTON IN MARKER POP UP / SEARCH RESULT
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

// SHOW SEARCH QUERY LAYER / FOOD MARKERS
function getFoodNearMarker(container, latlng) {
  let [lng, lat] = latlng.split(",");
  container.on("click", ".nearbyFoodBtn", async function () {
    showSearchPanel();
    let test = await middle(lat, lng);
    let [items, marker] = test;
    searchByDistanceArr = [...items];
    searchResultArr = [...items];
    foodMarkersArr = { ...marker };
    openFoodPopUp();
    sortFoodResultByDistance();
  });
}

// ADD FOOD MARKERS TO MAP
function addFoodMarkertoMap(mymap) {
  let searchResultBox = document.querySelector(".search-results");
  if (searchResultBox.innerHTML !== "" || searchQueryLayer) {
    searchQueryLayer.addTo(mymap);
  }
}

// DISPLAY FOOD RESULT/MARKERS ON MAP DEPENDING ON MAP CENTER
async function getNearbyFood(query, mymap) {
  document.querySelector(".sort-by").style.visibility = "hidden";
  let { lat, lng } = mymap.getCenter();
  let result = await search(lat, lng, query);
  console.log(result.response.groups[0].items);
  searchQueryLayer.clearLayers();
  let names = [];
  let marker = {};
  let items = [...result.response.groups[0].items];

  let searchResultDiv = document.querySelector(".search-results");
  searchResultDiv.innerHTML = "";
  searchResultDiv.style.margin = "0rem";
  searchResultDiv.style.transform = "translateY(-38px)";
  for (let rec of result.response.groups[0].items) {
    let name = rec.venue.name;

    let icon =
      rec.venue.categories[0].icon.prefix +
      "60" +
      rec.venue.categories[0].icon.suffix;

    // ADD MARKER TO SEARCH QUERY LAYER
    marker[rec.venue.id] = L.marker(
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
    mouseOverOrOut(marker[rec.venue.id]);

    let p = document.createElement("div");
    p.innerHTML = `<span><img src="${icon}"></span> <p>${name}</p> `;
    p.classList.add("venue");

    searchResultDiv.appendChild(p);
  }

  names = [];
  addFoodMarkertoMap(mymap);
  searchByDistanceArr = [...items];
  searchResultArr = [...items];
  foodMarkersArr = { ...marker };
  openFoodPopUp();
  return [items, marker];
}

// REVERSE GEOCODING
function popUpAddress(layer) {
  let bind = (err, data) => {
    let t = data.features[0].place_name;
    layer.bindPopup(`<h1 style="text-align: center">${t}</h1>`);
  };
  return bind;
}

async function middle(lat, lng) {
  searchQueryLayer.clearLayers();

  let result = await search(lat, lng, "food");

  let names = [];
  marker = {};
  items = [...result.response.groups[0].items];
  // console.log(items);
  let searchResultDiv = document.querySelector(".search-results");
  searchResultDiv.innerHTML = "";
  document.querySelector(".sort-by").style.visibility = "visible";
  searchResultDiv.style.margin = "2rem";
  searchResultDiv.style.transform = "translateY(0px)";
  for (let rec of result.response.groups[0].items) {
    let name = rec.venue.name;
    let icon =
      rec.venue.categories[0].icon.prefix +
      "60" +
      rec.venue.categories[0].icon.suffix;

    let location = rec.venue.location.formattedAddress.join(",");
    let distance = rec.venue.location.distance;

    // ADD MARKER TO SEARCH QUERY LAYER
    marker[rec.venue.id] = L.marker(
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
    mouseOverOrOut(marker[rec.venue.id]);

    let p = document.createElement("div");
    p.innerHTML = `
    <span><img src="${icon}"></span>
    <div>
    <p>${name}</p>
    <p>${location}</p>
    <p>Distance Away: ${distance}m</p>`;
    p.classList.add("venue");

    searchResultDiv.appendChild(p);
  }

  names = [];
  // addFoodMarkertoMap(mymap);

  return [items, marker];
}

// Open PopUP when hover over food search result
function openFoodPopUp() {
  let foodSearchResults = document.querySelector(".search-results");
  foodSearchResults.addEventListener("mouseover", function (e) {
    if (e.target && e.target.nodeName == "P") {
      let foodResultName = e.target.innerHTML.slice(0, 9);
      for (i of searchResultArr) {
        if (i.venue.name.includes(foodResultName)) {
          foodMarkersArr[i.venue.id].openPopup();
        }
      }
    }
  });

  foodSearchResults.addEventListener("mouseout", function (e) {
    if (e.target && e.target.nodeName == "P") {
      let foodResultName = e.target.innerHTML.slice(0, 9);
      for (i of searchResultArr) {
        if (i.venue.name.includes(foodResultName)) {
          foodMarkersArr[i.venue.id].closePopup();
        }
      }
    }
  });
}

// SORT FOOD RESULTS BY DISTANCE OR RELEVANCE(DEFAULT)

function sortFoodResultByDistance() {
  let sortByDistance = document.getElementById("food");
  sortByDistance.addEventListener("change", function (e) {
    let value = e.target.value;
    let searchResultDiv = document.querySelector(".search-results");
    searchResults = document.createElement("div");
    searchResultDiv.innerHTML = "";
    searchResultDiv.appendChild(searchResults);
    // SORT BY DISTANCE
    if (value == "distance") {
      searchByDistanceArr.sort((a, b) =>
        a.venue.location.distance > b.venue.location.distance ? 1 : -1
      );
      searchResults.innerHTML = "";
      for (let i of searchByDistanceArr) {
        let name = i.venue.name;

        let icon =
          i.venue.categories[0].icon.prefix +
          "60" +
          i.venue.categories[0].icon.suffix;

        let distance = i.venue.location.distance;
        let location = i.venue.location.formattedAddress.join(",");
        let p = document.createElement("div");
        p.innerHTML = `
        <span><img src="${icon}"></span>
        <div>
        <p>${name}</p>
        <p>${location}</p>
        <p>Distance Away: ${distance}m</p>
        </div>`;
        p.classList.add("venue");

        searchResultDiv.appendChild(p);
      }
    } else if (value == "relevance") {
      searchResults.innerHTML = "";

      for (let i of searchResultArr) {
        let name = i.venue.name;

        let icon =
          i.venue.categories[0].icon.prefix +
          "60" +
          i.venue.categories[0].icon.suffix;
        let location = i.venue.location.formattedAddress.join(",");
        let distance = i.venue.location.distance;
        console.log(location);
        let p = document.createElement("div");
        p.innerHTML = `
        <span><img src="${icon}"></span>
        <div>
        <p>${name}</p>
        <p>${location}</p>
        <p>Distance Away: ${distance}m</p>
        </div>`;
        p.classList.add("venue");

        searchResultDiv.appendChild(p);
      }
    }
  });
}
