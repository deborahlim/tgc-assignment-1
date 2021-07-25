// Set Up foursquare API
async function search(lat, lng, query) {
  // setup search parameters
  let ll = lat + "," + lng;
  let response = await axios.get(
    "https://api.foursquare.com/v2/venues/explore",
    {
      params: {
        ll: ll,
        client_id: "2DFI0KPAFWAW0NV4GMLMSXGMBINKZLFDOWBXUSA2FARDWXBO",
        client_secret: "GS001PHKSG4L4P3YFRNEV30SRENYSVJIAK02AKPO0XIZ3F3Q",
        v: "20210717",
        query: query,
      },
    }
  );
  return response.data;
}

// Set up Taxi Availability API
async function updateTaxiAvail() {
  let response = await axios.get(
    "https://api.data.gov.sg/v1/transport/taxi-availability",
    {
      params: {
        query: "2021-07-25T16:58:48",
      },
    }
  );
  return response;
}

// get data
async function getData(url) {
  let response = await axios.get(url);
  return response;
}

L.mapbox.accessToken =
  "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q";
// let response = L.mapbox.geocoder("mapbox.places");
// console.log(response);

// response.query(
//   "Singapore",
//   // {
//   //   query: "Ang Mo Kio",
//   //   proximity: L.latLng(1.3691, 103.8454),
//   // },
//   pri
// );

// function pri(err, data) {
//   if (data.lbounds) {
//     mymap.fitBounds(data.lbounds);
//   } else if (data.latlng) {
//     mymap.setView([data.latlng[0], data.latlng[1]], 13);
//   }
// }
// onEachFeature: function (feature, layer) {
//   let geocoder = L.mapbox.geocoder("mapbox.places");
//   console.log(feature.geometry.coordinates);
//   console.log(layer);
//   // GEOCODING ////
//   // let t = geocoder.query("Singapore", pri, {
//   //   query: "Ang Mo Kio",
//   //   proximity: feature.geometry.coordinates,
//   // });
//   // console.log(t);
