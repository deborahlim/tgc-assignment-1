async function main() {
  function init() {
    let mymap = initMap();
    let userLocationBtn = document.getElementById("userLocation");
    taxiResultLayer = L.markerClusterGroup();
    heritageLayer = L.mapbox.featureLayer();
    treesLayer = L.mapbox.featureLayer();
    museumLayer = L.mapbox.featureLayer();
    searchQueryLayer = L.mapbox.featureLayer();
    userLocationLayer = L.mapbox.featureLayer();
    touristAttractionLayer = L.mapbox.featureLayer();
    markersGroup = L.featureGroup(
      heritageLayer,
      museumLayer,
      treesLayer,
      touristAttractionLayer
    );

    getMapLayers(mymap);
    addControlHeader();

    window.addEventListener("DOMContentLoaded", () => {
      // TOGGLE BETWEEN SIDEBAR AND DIRECTIONS VIEW
      let directionsBtn = document.getElementById("directionsBtn");
      directionsBtn.addEventListener("click", toggleView);

      // TOGGLE SIDE PANEL DISPLAY OPEN AND CLOSE
      let sidePanelToggleBtn = document.querySelector(
        ".side-panel-toggle-btn "
      );

      sidePanelToggleBtn.addEventListener("click", function () {
        toggleSidePanel(sidePanelToggleBtn);
      });

      // CLEAR MARKERS BUTTON
      let clearMapMarkersBtn = document.getElementById("clearMapMarkersBtn");
      clearMapMarkersBtn.addEventListener("click", function () {
        clearMarkers(mymap);
      });

      // CLEAR FOOD RESULTS BUTTON
      let clearFoodBtn = document.getElementById("clearFoodBtn");
      clearFoodBtn.addEventListener("click", function () {
        let FoodInput = document.getElementById("selectedFood");
        FoodInput.value = "";
        searchQueryLayer.clearLayers();
        searchResult.innerHTML = "";
      });

      //  FILTER ALL MARKERS BY KEYWORD USING CLICK BUTTON
      let searchByKeywordBtn = document.getElementById("keyWordBtn");

      searchByKeywordBtn.addEventListener("click", function () {
        resetMarkers(mymap);
        addControlHeader();
      });

      // FILTER ALL MARKERS BY KEYWORD USING ENTER BUTTON
      document
        .getElementById("keyWord")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            resetMarkers(mymap);
            addControlHeader();
          }
        });

      // BUTTON TO GET USER LOCATION
      userLocationBtn.addEventListener("click", function (e) {
        if (!navigator.geolocation) {
          console.log("Please enable location");
        } else {
          e.preventDefault();
          mymap.locate();
        }

        mymap.on("locationfound", function (e) {
          let { lat, lng } = e.latlng;
          mymap.fitBounds(e.bounds);
          let geocoder = L.mapbox.geocoder("mapbox.places");
          let address = popUpAddress(userLocationLayer);

          userLocationLayer
            .setGeoJSON({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
              properties: {
                "marker-size": "large",
                "marker-color": "#000000",
                "marker-symbol": "viewpoint",
              },
            })
            .addTo(mymap);
          showDirectionsPanel();
          geocoder.reverseQuery([lng, lat], address);
          mouseOverOrOut(userLocationLayer);
          //PUT CURRENT COORDINATES INTO DIRECTIONS ORIGIN INPUT
          let currentLocationInput = document.querySelector(
            "#mapbox-directions-origin-input"
          );
          currentLocationInput.dispatchEvent(
            new Event("input", { bubbles: true })
          );
          currentLocationInput.value = `${lng}, ${lat}`;
          currentLocationInput.focus();
        });
      });

      // BUTTON TO SEARCH FOR NEARBY FOOD

      let nearbyFoodBtn = document.getElementById("getNearbyFoodBtn");

      nearbyFoodBtn.addEventListener("click", async function () {
        marker = {};
        items = [];
        await getNearbyFood("food", mymap);
      });

      // SEARCH INPUT FOR SPECIFIC FOOD BY BUTTON CLICK OR PRESSING ENTER
      let searchFoodInput = document.getElementById("selectedFood");
      let searchFoodButton = document.getElementById("selectedFoodBtn");

      searchFoodButton.addEventListener("click", async function () {
        marker = {};
        await getNearbyFood(searchFoodInput.value, mymap);
      });

      searchFoodInput.addEventListener("keypress", async function (e) {
        marker = {};
        if (e.key == "Enter") {
          await getNearbyFood(searchFoodInput.value, mymap);
        }
      });

      // ADD FOOD MARKERS ON TO MAP
      heritageLayer.on("click", function (ev) {
        addFoodMarkertoMap(mymap);
      });

      museumLayer.on("click", function (ev) {
        addFoodMarkertoMap(mymap);
      });

      touristAttractionLayer.on("click", function (ev) {
        addFoodMarkertoMap(mymap);
      });

      // INPUT LAT LNG ON FOOD MARKER CLICK
      searchQueryLayer.on("click", function (e) {
        openSidePanel(sidePanelToggleBtn);
        showDirectionsPanel();
        let latlng = `${e.latlng.lng}, ${e.latlng.lat}`;
        let directionInput = document.querySelector(
          "#mapbox-directions-destination-input"
        );
        showDirectionsPanel();

        // https://stackoverflow.com/questions/35659430/how-do-i-programmatically-trigger-an-input-event-without-jquery
        directionInput.dispatchEvent(new Event("input", { bubbles: true }));
        directionInput.value = latlng;
        directionInput.focus();
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
        console.log(e);
        let { lat, lng } = e.latlng;
        let geocoder = L.mapbox.geocoder("mapbox.places");
        let address = popUpAddress(taxiResultLayer);
        geocoder.reverseQuery([lng, lat], address);
      });

      // ADD TOURIST ATTRACTION DETAILS TO SIDEBAR ON CLICK
      touristAttractionLayer.on("click", async function (e) {
        openSidePanel(sidePanelToggleBtn);
        showSearchPanel();
        // document.querySelector(".sort-by").style.visibility = "hidden";
        // variables for tourist attraction box
        let temp = document.createElement("div");

        temp.innerHTML = `${e.layer.feature.properties.description}`;
        let tds = temp.querySelectorAll("td");

        if (
          tds[7].innerText.includes("Null") ||
          tds[7].innerText.slice(17).includes("hajjah-fatimah-mosque")
        ) {
          photo = "";
        } else photo = "https://www.visitsingapore" + tds[7].innerText.slice(17);
        let name = tds[13].innerHTML;
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
        getFoodNearMarker(touristAttraction, latlng, mymap);

        touristAttraction.html(
          link === "Unavailable"
            ? `
              <img src="${photo}" onerror="this.style.display='none'">
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
      <div class="directionsPopupBtn cursor">
      <i class="fas fa-directions fa-2x"></i>Get Directions
      </div>
      <div class="nearbyFoodBtn cursor">
      <i class="fas fa-utensils fa-2x"></i>Find Nearby Food
      </div>`
            : `
              <img src="${photo}" onerror="this.style.display='none'">
       <h1>
      ${name}
       </h1>
       <div>
       <a href="${link}" target="_blank" class="attraction-link cursor"><i class="fas fa-globe-americas fa-2x"></i></a>
       <a href="${link}" target="_blank class="cursor"><span class="truncate">${link}</span></a>
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
       <div class="directionsPopupBtn cursor">
       <i class="fas fa-directions fa-2x "></i>Get Directions
       </div>
       <div class="nearbyFoodBtn cursor">
       <i class="fas fa-utensils fa-2x"></i>Explore Nearby Food
       </div>
       `
        );

        searchResult.innerHTML = "";
        if (!searchResult.innerHTML.includes("tourist-attraction-box")) {
          searchResult.style.margin = "0rem";
          searchResult.style.transform = "translateY(-38px)";
        }
        searchResult.insertAdjacentElement("beforeend", touristAttraction[0]);
      });
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
      minZoom: 12,
    })
    .setView([1.3521, 103.8198], 12)
    .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));

  // mymap.setMaxBounds(mymap.getBounds());

  // BUTTON TO TOGGLE FULL SCREEN
  // mymap.addControl(new L.Control.Fullscreen());

  // WHEN CLICK ON MAP TOGGLE SIDE PANEL
  mymap.on("click", toggleView);

  return mymap;
}

// CALL MAIN FUNCTION
main();
