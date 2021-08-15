// TAXI AVAILABILTY LAYER
async function getTaxiLayer() {
  let response = await updateTaxiAvail();
  taxiResultLayer.clearLayers();
  // ADD MARKERS TO TAXI LAYER
  L.geoJSON(response.data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      let test = L.marker(latlng, {
        icon: L.mapbox.marker.icon({
          "marker-symbol": "car",
          "marker-color": "#F1ee1e",
        }),
      });
      return test;
    },
  }).addTo(taxiResultLayer);
  // To get updated taxi data every minute
  setTimeout(getTaxiLayer, 6000);
}

// HISTORIC SITE LAYER
async function getHeritageLayer(heritageLayer) {
  let response = await getData("data/historic-sites-geojson.geojson");

  L.geoJSON(response.data, {
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
      let e = document.createElement("div");
      e.innerHTML = feature.properties.Description;
      let tds = e.querySelectorAll("td");
      // console.log(tds);
      let photo = tds[3].innerHTML;
      let name = tds[4].innerHTML;
      let description = tds[6].innerHTML;
      let address = `${tds[9].innerHTML}, ${tds[10].innerHTML}`;
      if (!tds[9].innerHTML) address = tds[10].innerHTML;
      if (!tds[10].innerHTML) address = tds[9].innerHTML;
      let latlng = `${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[1]}`;
      let container = $("<div />");

      let link =
        tds[5].innerText.slice(30).includes("phoenix-park") ||
        tds[5].innerText.slice(30).includes("pasir-panjang-battle") ||
        tds[5].innerText.slice(30).includes("kranji-beach-battle") ||
        tds[5].innerText
          .slice(30)
          .includes("oversea-chinese-banking-coporation") ||
        tds[5].innerText.slice(30).includes("farrer-park") ||
        tds[5].innerText.slice(30).includes("adam-park-battle")
          ? new URL("/", "https://www.roots.gov.sg/")
          : new URL(
              `places/places-landing/${tds[5].innerText.slice(30)}`,
              `https://www.roots.gov.sg/`
            );
      inputLatLng(feature, container, latlng);
      getFoodNearMarker(container, latlng);
      container.html(`<div style="color: ${randDarkColor()}" class="popup-description"'>
      <div><img src="${photo}" onerror="this.style.display='none'""></div>
      <p>
           <a href="${link}" target="_blank">${name}</a>
      </p>
      <p>
           ${description}
      </p>
      <p>
           Address: ${address}
      </p>
      <br>
     <div class="directionsPopupBtn">
      <i  class="fas fa-directions fa-2x cursor tooltip-pu" style="float: right" ></i>
      <span class="tooltip-pu-text">Get Directions</span>
    </div>
     <div class="nearbyFoodBtn">
      <i class="fas fa-utensils fa-2x cursor tooltip-pu" style="float: right; margin-right:1rem" ></i>
      <span class="tooltip-pu-text">Explore Nearby Food</span>
     </div>
     <br>
   </div>`);
      layer.bindPopup(container[0]);
    },
    filter: function (feature) {
      let searchByKeywordInput = document
        .getElementById("keyWord")
        .value.toLowerCase()
        .trim()
        .replaceAll(".", "")
        .replaceAll(",", "")
        .replaceAll(" ", "");
      let lowercaseDescription =
        feature.properties.Description.toLowerCase().replaceAll(" ", "");

      if (lowercaseDescription.includes(searchByKeywordInput)) {
        return true;
      }
    },
    popupOptions: {
      keepInView: true,
    },
  }).addTo(heritageLayer);
}

// TOURIST ATTRACTION LAYER
async function getTouristAttractionLayer(touristAttractionLayer) {
  let custom = L.geoJSON(null, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: L.mapbox.marker.icon({
          "marker-symbol": "attraction",
          "marker-color": "#FFA500",
        }),
      });
    },
    onEachFeature: function (feature, layer) {
      let e = document.createElement("div");
      e.innerHTML = feature.properties.description;
      let tds = e.querySelectorAll("td");
      let photo;

      if (
        tds[7].innerText.includes("Null") ||
        tds[7].innerText.slice(17).includes("hajjah-fatimah-mosque")
      ) {
        photo = "";
      } else {
        photo = "https://www.visitsingapore" + tds[7].innerText.slice(17);
      }
      let latlng = `${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[1]}`;
      let name = tds[13].innerText;
      let container = $("<div />");
      inputLatLng(feature, container, latlng);
      getFoodNearMarker(container, latlng);

      container.html(
        `<div style=" color: ${randDarkColor()}" class="popup-description">
            <div><img src="${photo}" onerror="this.style.display='none'"></div>
            <h1>
              ${name}
            </h1>
            <div class="directionsPopupBtn">
              <i  class="fas fa-directions fa-2x  cursor tooltip-pu" style="float: right;" ></i>
              <span class="tooltip-pu-text">Get Directions</span>
            </div>
            <div class="nearbyFoodBtn">
              <i class="fas fa-utensils fa-2x cursor tooltip-pu" style="float: right; margin-right:1rem;" ></i>
              <span class="tooltip-pu-text">Explore Nearby Food</span>
            </div>
            <br>
          </div>`
      );
      layer.bindPopup(container[0]);
    },

    filter: function (feature) {
      let searchByKeywordInput = document
        .getElementById("keyWord")
        .value.toLowerCase()
        .trim()
        .replaceAll(".", "")
        .replaceAll(",", "")
        .replaceAll(" ", "");
      let lowercaseDescription = feature.properties.description
        .toLowerCase()
        .replaceAll(" ", "");

      if (lowercaseDescription.search(searchByKeywordInput) !== -1) {
        return true;
      }
    },
    popupOptions: {
      keepInView: true,
    },
  });
  await omnivore
    .kml("data/TOURISM.kml", null, custom)
    .addTo(touristAttractionLayer);
}

// MUSUEM LAYER
async function getMuseumLayer(museumLayer) {
  let response = await getData("data/museums-geojson.geojson");

  L.geoJSON(response.data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: L.mapbox.marker.icon({
          "marker-symbol": "museum",
          "marker-color": "#808080",
        }),
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.Description);
      let e = document.createElement("div");
      e.innerHTML = feature.properties.Description;
      let tds = e.querySelectorAll("td");

      let photo = tds[10].innerHTML;
      let name = tds[9].innerHTML;
      let description = tds[5].innerHTML;
      let address = `${tds[1].innerHTML}, ${tds[0].innerHTML} ${tds[3].innerHTML}, Singapore ${tds[2].innerHTML}`;
      if (!tds[1].innerHTML)
        address = `${tds[0].innerHTML} ${tds[3].innerHTML}, Singapore ${tds[2].innerHTML}`;
      if (!tds[3].innerHTML)
        address = `${tds[1].innerHTML}, , Singapore ${tds[2].innerHTML}`;
      let latlng = `${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[1]}`;
      let container = $("<div />");
      let link =
        tds[6].innerText.slice(30).includes("the-changi-museum") ||
        tds[6].innerText.slice(30).includes("eurasian-heritage-centre") ||
        tds[6].innerText.slice(30).includes("land-transport-gallery") ||
        tds[6].innerText.slice(30).includes("hdb-gallery")
          ? new URL("/", "https://www.nhb.gov.sg/")
          : new URL(
              `places/places-landing${tds[6].innerText.slice(30)}`,
              `https://www.roots.gov.sg/`
            );
      inputLatLng(feature, container, latlng);
      getFoodNearMarker(container, latlng);
      container.html(
        `<div style=" color: ${randDarkColor()}" class="popup-description">
                    <div><img src="${photo}" onerror="this.style.display='none'"></div>
                    <p>
                         <a href="${link}" target="_blank">${name}</a>
                    </p>
                    <p>
                         ${description}
                    </p>
                    <p>
                         Address: ${address}
                    </p>
                    <br>
                    <div class="directionsPopupBtn">
                      <i  class="fas fa-directions fa-2x cursor tooltip-pu" style="float: right" ></i>
                      <span class="tooltip-pu-text">Get Directions</span>
                    </div>
                    <div class="nearbyFoodBtn">
                      <i class="fas fa-utensils fa-2x cursor tooltip-pu" style="float: right; margin-right:1rem" ></i>
                      <span class="tooltip-pu-text">Explore Nearby Food</span>
                    </div>
                    <br>
                 </div>`
      );

      layer.bindPopup(container[0]);
    },
    filter: function (feature) {
      let searchByKeywordInput = document
        .getElementById("keyWord")
        .value.toLowerCase()
        .trim()
        .replace(".", "");
      let lowercaseDescription = feature.properties.Description.toLowerCase();

      if (lowercaseDescription.search(searchByKeywordInput) !== -1) {
        return true;
      }
    },
    popupOptions: {
      keepInView: true,
    },
  }).addTo(museumLayer);
}

// HERITAGE TREES LAYER
async function getTreesLayer(treesLayer) {
  let response = await getData("data/heritage-trees-geojson.geojson");

  L.geoJSON(response.data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: L.mapbox.marker.icon({
          "marker-size": "small",
          "marker-symbol": "park",
          "marker-color": "#228B22",
        }),
      });
    },
    onEachFeature: function (feature, layer) {
      let e = document.createElement("div");
      e.innerHTML = feature.properties.Description;
      let tds = e.querySelectorAll("td");
      //console.log(tds);
      let name = tds[4].innerHTML;
      let description = tds[6].innerHTML;

      layer.bindPopup(`<div style=" color: ${randDarkColor()}; width:300px">
                    <p style="font-weight:800">
                         ${name}
                    </p>
                    <p>
                         ${description}
                    </p>
                 </div>`);

      mouseOverOrOut(layer);
    },
    filter: function (feature) {
      let searchByKeywordInput = document
        .getElementById("keyWord")
        .value.toLowerCase()
        .trim()
        .replace(".", "");
      let lowercaseDescription = feature.properties.Description.toLowerCase();

      if (lowercaseDescription.search(searchByKeywordInput) !== -1) {
        return true;
      }
    },
    popupOptions: {
      keepInView: true,
    },
  }).addTo(treesLayer);
}

function getDirections(mymap) {
  // move the attribution control out of the way

  //create the initial directions object, from which the layer
  //and inputs will pull data.
  directions = L.mapbox.directions();
  L.mapbox.accessToken =
    "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";
  L.mapbox.directions.layer(directions).addTo(mymap);

  L.mapbox.directions.inputControl("inputs", directions).addTo(mymap);

  L.mapbox.directions.errorsControl("errors", directions).addTo(mymap);

  L.mapbox.directions.routesControl("routes", directions).addTo(mymap);

  L.mapbox.directions
    .instructionsControl("instructions", directions)
    .addTo(mymap);
}

// Render layers on mymap
function getMapLayers(mymap) {
  getTaxiLayer(taxiResultLayer);
  getDirections(mymap);
  getHeritageLayer(heritageLayer);
  getTreesLayer(treesLayer);
  getMuseumLayer(museumLayer);
  getTouristAttractionLayer(touristAttractionLayer);

  let baseLayers = {
    "Street View": L.mapbox
      .styleLayer("mapbox://styles/mapbox/streets-v11")
      .addTo(mymap),
    "Outdoor View": L.mapbox.styleLayer("mapbox://styles/mapbox/outdoors-v11"),
    "Satellite View": L.mapbox.styleLayer(
      "mapbox://styles/mapbox/satellite-v9"
    ),
  };
  let overlays = {
    "Tourist Attractions": touristAttractionLayer,
    Museums: museumLayer,
    "Historic Sites": heritageLayer,
    "Heritage Trees": treesLayer,
  };

  L.control.layers(baseLayers, overlays).addTo(mymap);
}
