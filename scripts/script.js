async function main() {
  function init() {
    mymap = initMap();
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
      // EVENT LISTENERS
      // WHEN CLICK ON MAP SHOW DIRECTIONS PANEL
      mymap.on("click", function () {
        openSidePanel(sidePanelToggleBtn);
        showDirectionsPanel();
      });

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

      // CLEAR MAP MARKERS BUTTON
      let clearMapMarkersBtn = document.getElementById("clearMapMarkersBtn");

      clearMapMarkersBtn.addEventListener("click", function () {
        clearMarkers(mymap);
        mymap.setView([1.3521, 103.8198], 12);
      });

      // CLEAR FOOD RESULTS BUTTON
      let clearFoodBtn = document.getElementById("clearFoodBtn");

      clearFoodBtn.addEventListener("click", function () {
        clearFoodMarkers();
        mymap.setView([1.3521, 103.8198], 12);
      });

      //  FILTER ALL MARKERS BY KEYWORD CLICK BUTTON
      let searchByKeywordBtn = document.getElementById("keyWordBtn");

      searchByKeywordBtn.addEventListener("click", function () {
        resetMarkers(mymap);
        addControlHeader();
      });

      // FILTER ALL MARKERS BY KEYWORD ENTER BUTTON
      document
        .getElementById("keyWord")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            resetMarkers(mymap);
            addControlHeader();
          }
        });

      // USER LOCATION BUTTON
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

          // PUT CURRENT COORDINATES INTO DIRECTIONS ORIGIN INPUT
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

      // EXPLORE NEARBY FOOD BUTTON
      let nearbyFoodBtn = document.getElementById("getNearbyFoodBtn");

      nearbyFoodBtn.addEventListener("click", async function () {
        marker = {};
        items = [];
        await getNearbyFood("food", mymap);
        mymap.fitBounds(searchQueryLayer.getBounds());
      });

      // SPECIFIC FOOD SEARCH INPUT BUTTON / ENTER KEYPRESS
      let searchFoodInput = document.getElementById("selectedFood");
      let searchFoodButton = document.getElementById("selectedFoodBtn");

      searchFoodButton.addEventListener("click", async function () {
        marker = {};
        await getNearbyFood(searchFoodInput.value, mymap);
        mymap.fitBounds(searchQueryLayer.getBounds());
      });

      searchFoodInput.addEventListener("keypress", async function (e) {
        marker = {};
        if (e.key == "Enter") {
          await getNearbyFood(searchFoodInput.value, mymap);
          mymap.fitBounds(searchQueryLayer.getBounds());
        }
      });

      // ADD FOOD MARKERS ON TO MAP
      heritageLayer.on("click", function () {
        addFoodMarkertoMap(mymap);
        clearTouristAttractionBox();
      });

      museumLayer.on("click", function () {
        addFoodMarkertoMap(mymap);
        clearTouristAttractionBox();
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
        let { lat, lng } = e.latlng;
        let geocoder = L.mapbox.geocoder("mapbox.places");
        let address = popUpAddress(taxiResultLayer);
        geocoder.reverseQuery([lng, lat], address);
      });

      // ADD TOURIST ATTRACTION DETAILS TO SIDEBAR ON CLICK
      touristAttractionLayer.on("click", async function (e) {
        mymap.flyTo([e.latlng.lat, e.latlng.lng]);
        addFoodMarkertoMap(mymap);
        openSidePanel(sidePanelToggleBtn);
        showSearchPanel();
        document.querySelector(".sort-by").style.visibility = "hidden";
        // CREATE TOURIST ATTRACTION BOX AND INSERT INTO DOM
        let touristAttractionBox = await createTouristAttractionBox(e);
        searchResult.innerHTML = "";
        if (!searchResult.innerHTML.includes("tourist-attraction-box")) {
          searchResult.style.margin = "0rem";
          searchResult.style.transform = "translateY(-38px)";
        }
        searchResult.insertAdjacentElement(
          "beforeend",
          touristAttractionBox[0]
        );
      });
    });
  }
  init();
}

// INIIALISE MAP
function initMap() {
  L.mapbox.accessToken =
    "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";
  let mymap = L.mapbox
    .map("map", null, { zoomControl: false })
    .setView([1.3521, 103.8198], 12)
    .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));
  mymap.attributionControl.setPosition("bottomright");
  mymap.addControl(L.control.zoom({ position: "bottomright" }));
  return mymap;
}

// CALL MAIN FUNCTION
let mymap;
main();
