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
    desiredWidth = "45%";
  } else if (window.innerWidth < "1025") {
    desiredWidth = "40%";
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
  mymap.addLayer(heritageLayer);
  mymap.addLayer(museumLayer);
  mymap.addLayer(treesLayer);
  mymap.addLayer(touristAttractionLayer);
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
    let result = await search(lat, lng, "food");
    searchQueryLayer.clearLayers();
    marker = {};
    items = [...result.response.groups[0].items];
    let searchResultDiv = document.querySelector(".search-results");
    showFoodSearchResults(items, searchResultDiv);
    document.querySelector(".sort-by").style.visibility = "visible";
    // document.getElementById(
    //   "relevance"
    // ).innerHTML = `<option value="relevance" selected>Relevance</option>`;
    searchResultDiv.style.transform = "translateY(0px)";
    searchByDistanceArr = [...items];
    searchResultArr = [...items];
    foodMarkersArr = { ...marker };

    sortFoodResultByDistance();
    openFoodPopUp();
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
  searchQueryLayer.clearLayers();
  let items = [...result.response.groups[0].items];
  let searchResultDiv = document.querySelector(".search-results");

  showFoodSearchResults(items, searchResultDiv);
  addFoodMarkertoMap(mymap);
  searchResultDiv.style.marginBottom = "-38px";
  searchResultDiv.style.transform = "translateY(-38px)";
  searchResultArr = [...items];
  foodMarkersArr = { ...marker };
  openFoodPopUp();
}

// REVERSE GEOCODING
function popUpAddress(layer) {
  let bind = (err, data) => {
    let t = data.features[0].place_name;
    layer.bindPopup(`<h1 style="text-align: center">${t}</h1>`);
  };
  return bind;
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
    // SORT BY DISTANCE
    if (value == "distance") {
      searchByDistanceArr.sort((a, b) =>
        a.venue.location.distance > b.venue.location.distance ? 1 : -1
      );

      showFoodSearchResults(searchByDistanceArr, searchResultDiv);
    } else if (value == "relevance") {
      showFoodSearchResults(searchResultArr, searchResultDiv);
    }
    // openFoodPopUp();
  });
}

// SHOW FOOD RESULTS IN SIDE PANEL
function showFoodSearchResults(arr, searchResultDiv) {
  let sortBy = document.querySelector(".sort-by");
  searchResults = document.createElement("div");
  searchResultDiv.innerHTML = "";
  searchResultDiv.appendChild(searchResults);
  searchResults.innerHTML = "";
  // searchQueryLayer.clearLayers();
  for (let i of arr) {
    let name = i.venue.name;

    let icon =
      i.venue.categories[0].icon.prefix +
      "60" +
      i.venue.categories[0].icon.suffix;

    let distance = i.venue.location.distance;
    let [address, postCode, country] = [...i.venue.location.formattedAddress];
    let location;
    if (i.venue.location.formattedAddress.length === 3) {
      location = `${address}, ${country} ${postCode}`;
    } else if (i.venue.location.formattedAddress.length === 2) {
      location = `${address}, ${postCode}`;
    } else {
      location = `${address}`;
    }

    let p = document.createElement("div");
    p.innerHTML =
      sortBy.style.visibility == "hidden"
        ? `
    <span><img src="${icon}"></span>
    <div class="venue-details">
    <p>${name}</p>
    <p>${location}</p>
    </div>`
        : `
    <span><img src="${icon}"></span>
    <div class="venue-details">
    <p>${name}</p>
    <p>${location}</p>
    <p>Distance Away: ${distance}m</p>
    </div>`;
    p.classList.add("venue");

    searchResultDiv.appendChild(p);

    if (
      sortBy.style.visibility == "hidden" ||
      searchQueryLayer.getLayers().length < 30
    ) {
      addMarkertoSearchQueryLayer(i);
    }
  }
}

// ADD MARKER TO SEARCH QUERY LAYER
function addMarkertoSearchQueryLayer(obj) {
  let id = obj.venue.id;
  marker[id] = L.marker([obj.venue.location.lat, obj.venue.location.lng], {
    icon: L.mapbox.marker.icon({
      "marker-symbol": "restaurant",
      "marker-color": "#800080",
    }),
  })
    .bindPopup(
      `<h1 style="text-align: center; min-width:100px; padding-top:1.3rem">${obj.venue.name}</h1>`
    )
    .addTo(searchQueryLayer);
  mouseOverOrOut(marker[id]);
}
