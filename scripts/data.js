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
  let response = await axios.get(url, { withCredentials: true });
  return response;
}
