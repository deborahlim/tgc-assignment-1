// Add GeoJSON data to the taxi cluster group
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
// Add GeoJSON data to the heritage feature group
async function getHeritageLayer(heritageLayer) {
  let searchByKeywordInput = document.getElementById("keyWord");
  let response = await getData("data/historic-sites-geojson.geojson");
  console.log(response.data);

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
      layer.bindPopup(feature.properties.Description);
      let e = document.createElement("div");
      e.innerHTML = feature.properties.Description;
      let tds = e.querySelectorAll("td");
      //console.log(tds);
      let photo = tds[3].innerHTML;
      let name = tds[4].innerHTML;
      let link = tds[5].innerHTML;
      let description = tds[6].innerHTML;
      let address = `${tds[9].innerHTML}, ${tds[10].innerHTML}`;
      if (!tds[9].innerHTML) address = tds[10].innerHTML;
      if (!tds[10].innerHTML) address = tds[9].innerHTML;

      layer.bindPopup(`<div style=" color: ${randDarkColor()}"; width:100%>
                    <div style="width:100%"><img src="${photo}" alt="Photo of ${name}" style="width:100%"></div>
                    <a href=${link} target="_blank" style="text-decoration:none; color:inherit;"><p style="font-weight:800">
                         ${name}
                    </p></a>
                    <p>
                         Description: ${description}
                    </p>
                    <p>
                         Address: ${address}
                    </p>
                 </div>`);
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
      //className: "heritagePopup",
      keepInView: true,
    },
  }).addTo(heritageLayer);
}

async function getTreesLayer(treesLayer) {
  let searchByKeywordInput = document.getElementById("keyWord");
  let response = await getData("data/heritage-trees-geojson.geojson");
  console.log(response.data);

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
      layer.bindPopup(feature.properties.Description);
      let e = document.createElement("div");
      e.innerHTML = feature.properties.Description;
      let tds = e.querySelectorAll("td");
      //console.log(tds);
      let photo = tds[3].innerHTML;
      let name = tds[4].innerHTML;
      let link = tds[5].innerHTML;
      let description = tds[6].innerHTML;
      let address = `${tds[9].innerHTML}, ${tds[10].innerHTML}`;
      if (!tds[9].innerHTML) address = tds[10].innerHTML;
      if (!tds[10].innerHTML) address = tds[9].innerHTML;

      let randomColor = Math.floor(Math.random() * 16777215).toString(16);
      layer.bindPopup(`<div style=" color: #${randomColor}"; width:100%>
                    <div style="width:100%"><img src="${photo}" alt="Photo of ${name}" style="width:100%"></div>
                    <a href=${link} target="_blank" style="text-decoration:none; color:inherit;"><p style="font-weight:800">
                         ${name}
                    </p></a>
                    <p>
                         Description: ${description}
                    </p>
                    <p>
                         Address: ${address}
                    </p>
                 </div>`);
    },
    filter: function (feature) {
      let searchByKeywordInput = document
        .getElementById("keyWord")
        .value.toLowerCase()
        .trim()
        .replace(".", "");
      let lowercaseDescription = feature.properties.Description.toLowerCase();

      if (lowercaseDescription.search(searchByKeywordInput) !== -1) {
        console.log(feature);
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
  getMrtStations();

  let baseLayers = {
    "Street View": L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"),
    "Outdoor View": L.mapbox.styleLayer("mapbox://styles/mapbox/outdoors-v11"),
    "Satellite View": L.mapbox.styleLayer(
      "mapbox://styles/mapbox/satellite-v9"
    ),
  };
  let overlays = {
    //Taxis: taxiResultLayer,
    "Historic Sites": heritageLayer,
    "Heritage Trees": treesLayer,

    // "MRT Stations": mrtStationsLayer,
    //Search: searchQueryLayer,
  };
  L.control
    .layers(baseLayers, overlays, {
      // collapsed: false,
    })
    .addTo(mymap);
}
