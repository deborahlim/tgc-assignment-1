// Set Up SG Map
let mymap = L.map("map").setView([1.3521, 103.8198], 13);

// Add Mapbox Streets tile layer
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 12,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiZGVib3JhaGxpbWh5IiwiYSI6ImNrcjIzeTduMjFhbTQyeXM2Ync0czRyOWkifQ.k75OvVZniQOHYuxc0QQS0Q",
  }
).addTo(mymap);

// Get user location
L.control.locate().addTo(mymap);

// Map Layers

// Add marker when user clicks on map
// Create pop up for each marker and display the location
let markers = [];
let results = [];
let names = [];

let searchInputBox = document.querySelector("#setBtn");
let searchBtn = document.querySelector("#searchBtn");
let selectedSearchInput = document.querySelector("#selectedSearch");
let searchResultDiv = document.querySelector(".searchResultDiv");
let searchResults = document.createElement("div");
mymap.on("click", async function (ev) {
  // if there is no marker on the map, do the following
  let result = await search(ev.latlng.lat, ev.latlng.lng);
  results.push(result);
  console.log(result);
  let currentMarker = L.marker([ev.latlng.lat, ev.latlng.lng])
    .bindPopup(`${ev.latlng.lat}, ${ev.latlng.lng}`)
    .addTo(mymap);
  markers.push(currentMarker);

  // input lat lng of marker into search input box and display results
  selectedSearchInput.value = `${ev.latlng.lat}, ${ev.latlng.lng}`;
  searchBtn.addEventListener("click", () => {
    for (let rec of result.response.groups[0].items) {
      names.push(rec.venue.name);
    }

    searchResultDiv.appendChild(searchResults);
    searchResults.innerHTML = "";
    for (let i of names) {
      let p = document.createElement("p");
      p.innerHTML = `${i}`;
      p.className = "searchResult";
      searchResults.appendChild(p);
    }

    names = [];
  });

  // if there is a marker on the map, remove it
});
