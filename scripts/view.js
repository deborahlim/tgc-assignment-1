// TAXI AVAILABILTY LAYER
async function getTaxiLayer() {
  let response = await updateTaxiAvail();
  taxiResultLayer.clearLayers();

  /// ADD MARKERS TO TAXI LAYER /////
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
  // setTimeout(getTaxiLayer, 6000);
}

// HISTORIC SITE LAYER
async function getHeritageLayer(heritageLayer) {
  let searchByKeywordInput = document.getElementById("keyWord");
  let response = await getData("data/historic-sites-geojson.geojson");
  // console.log(response);

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
      // https://stackoverflow.com/questions/13698975/click-link-inside-leaflet-popup-and-do-javascript
      let container = $("<div />");

      inputLatLng(feature, container, latlng);

      container.html(`<div style=" color: ${randDarkColor()}; width:300px">
      <div style="width:100%"><img src="${photo}" alt="Photo of ${name}" style="width:100%"></div>
      <p style="font-weight:900">
           ${name}
      </p>
      <p>
           ${description}
      </p>
      <p>
           Address: ${address}
      </p>
      <br>
     <div class="directionsPopupBtn"><i  class="fas fa-directions fa-2x" style="float: right;" ></i></div>
     <br>
   </div>`);
      // layer.bindPopup(`<div style=" color: ${randDarkColor()}; width:300px">
      //             <div style="width:100%"><img src="${photo}" alt="Photo of ${name}" style="width:100%"></div>
      //             <p style="font-weight:900">
      //                  ${name}
      //             </p>
      //             <p>
      //                  ${description}
      //             </p>
      //             <p>
      //                  Address: ${address}
      //             </p>
      //             <br>
      //            <p class="directionsPopupBtn"><i  class="fas fa-directions fa-2x" style="float: right;" ></i></p>
      //            <br>
      //          </div>`);
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
      // console.log(lowercaseDescription);
      // if (lowercaseDescription.search(searchByKeywordInput) !== -1) {
      //   console.log(lowercaseDescription.search(searchByKeywordInput));
      //   return true;
      // }
      // console.log(lowercaseDescription.search(searchByKeywordInput));

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
  let searchByKeywordInput = document.getElementById("keyWord");

  let custom = L.geoJSON(null, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: L.mapbox.marker.icon({
          "marker-symbol": "attraction",
          "marker-color": "#C45bc4",
        }),
      });
    },
    onEachFeature: function (feature, layer) {
      // console.log(layer);
      let e = document.createElement("div");
      e.innerHTML = feature.properties.description;
      let tds = e.querySelectorAll("td");
      // console.log(tds);
      let photo;
      if (tds[7].innerText.slice(17)) {
        photo = "https://www.visitsingapore" + tds[7].innerText.slice(17);
      } else photo = "";
      let latlng = `${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[1]}`;
      // console.log(photo);
      let name = tds[13].innerText;
      let container = $("<div />");
      inputLatLng(feature, container, latlng);

      container.html(
        `<div style=" color: ${randDarkColor()}; width:300px">
                    <div style="width:100%"><img src="${photo}" alt="Photo of ${name}" style="width:100%; height:100%"></div>
                    <p style="font-weight:800">
                         ${name}
                    </p>
                    <div class="directionsPopupBtn"><i  class="fas fa-directions fa-2x" style="float: right;" ></i></div>
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
      // console.log(lowercaseDescription);
    },
    popupOptions: {
      //className: "touristAttractionPopup",
      keepInView: true,
    },
  });
  omnivore.kml("data/TOURISM.kml", null, custom).addTo(touristAttractionLayer);
}

// MUSUEM LAYER
async function getMuseumLayer(museumLayer) {
  let searchByKeywordInput = document.getElementById("keyWord");
  let response = await getData("data/museums-geojson.geojson");
  // console.log(response.data);

  L.geoJSON(response.data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: L.mapbox.marker.icon({
          "marker-symbol": "museum",
          "marker-color": "#ff4500 ",
        }),
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.Description);
      let e = document.createElement("div");
      e.innerHTML = feature.properties.Description;
      let tds = e.querySelectorAll("td");
      //console.log(tds);
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

      inputLatLng(feature, container, latlng);

      container.html(
        `<div style=" color: ${randDarkColor()}; width:300px">
                    <div style="width:100%"><img src="${photo}" alt="Photo of ${name}" style="width:100%"></div>
                    <p style="font-weight:800">
                         ${name}
                    </p>
                    <p>
                         ${description}
                    </p>
                    <p>
                         Address: ${address}
                    </p>
                    <br>
                    <div class="directionsPopupBtn"><i  class="fas fa-directions fa-2x" style="float: right;" ></i></div>
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
      //className: "museumPopup",
      keepInView: true,
    },
  }).addTo(museumLayer);
}

// HERITAGE TREES LAYER
async function getTreesLayer(treesLayer) {
  let searchByKeywordInput = document.getElementById("keyWord");
  let response = await getData("data/heritage-trees-geojson.geojson");
  // console.log(response.data);

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
      // let link = tds[5].innerHTML;
      let description = tds[6].innerHTML;

      layer.bindPopup(`<div style=" color: ${randDarkColor()}; width:300px">
                    <p style="font-weight:800">
                         ${name}
                    </p>
                    <p>
                         ${description}
                    </p>
                 </div>`);

      layer.on("mouseover", function (e) {
        this.openPopup();
      });

      layer.on("mouseout", function (e) {
        this.closePopup();
      });
    },
    filter: function (feature) {
      let searchByKeywordInput = document
        .getElementById("keyWord")
        .value.toLowerCase()
        .trim()
        .replace(".", "");
      let lowercaseDescription = feature.properties.Description.toLowerCase();

      if (lowercaseDescription.search(searchByKeywordInput) !== -1) {
        // console.log(feature);
        return true;
      }
    },
    popupOptions: {
      //className: "heritagePopup",
      keepInView: true,
    },
  }).addTo(treesLayer);
}

async function getMrtStations() {
  let response = await getData("data/lta-mrt-station-exit-geojson.geojson");
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
  getTaxiLayer(taxiResultLayer);
  getDirections(mymap);
  getHeritageLayer(heritageLayer);
  getTreesLayer(treesLayer);
  getMuseumLayer(museumLayer);
  getMrtStations();
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
    //Taxis: taxiResultLayer,

    "Historic Sites": heritageLayer,
    "Heritage Trees": treesLayer,
    "Tourist Attractions": touristAttractionLayer,
    Museums: museumLayer,

    // "MRT Stations": mrtStationsLayer,
    //Search: searchQueryLayer,
  };

  let c = L.control.layers(baseLayers, overlays, {
    // collapsed: false,
  });
  c.addTo(mymap);
}
