# tgc-assignment-1

Project 1 SG Attractions & Heritage Map

Context

This project is a web application based on an interactive map of Singapore’s Attractions and Heritage Sites.

It provides to the user:

1. Information about Singapore’s heritage sites and tourist attractions, including museums, historic sites and heritage trees.
2. Routing services and directions to locations
3. Taxi transport information as a transport option
4. Search and sorting functionality, allowing the user to display specific map markers.
5. Food recommendations based on user location, map view and map markers, and user input

External User Goals:
To find interesting places to visit in Singapore, learn about Singapore’s heritage and find an app that shows me how to get to such places

Organisation Goals:
To give Singapore a distinctive and favourable identity in the map of the world and promote greater community ownership over Singaporeans’ shared heritage (according to SG Heritage Board & Centre for Liveable Cities)

Demo

A live website can be found here <LINK>
Screenshot

Defining the Project (Strategy, Scope)

A) Strategy

Site Owner / Organisational Goals:

1. Increase awareness of and interest for historic sites, museums and tourist attractions in Singapore
2. Increase Singapore’s attractiveness as a tourist destination
3. Promote F&B Businesses in Singapore

Identifying External Users:

1. Tourists
2. History Enthusiasts
3. Singapore residents
4. Anyone wanting to learn about Singapore’s heritage
5. Anyone wanting to find interesting places in Singapore

Identifying External Users’ Goals:

1. To search for heritage sites / tourist attractions in Singapore
2. To get information about heritage sites / tourist attractions in SG
3. To get directions to reach heritage sites / tourist attractions in SG
4. To explore food options near their location or near attractions / heritage sites

User goals/ Stories:

1. As a tourist / Singaporean / history enthusiast, I want to find out more information about heritage site / attractions so that I can decide when to visit / get more knowledge.
2. As a tourist / Singaporean / history enthusiast, I want to find tourist attractions / historical sites / food near my current location so that I can visit them conveniently without making detours.
3. As a tourist / Singaporean / history enthusiast, I want to filter the heritage site / attractions according to a keyword so that I can see only those that I am interested in.
4. As a tourist / Singaporean / history enthusiast, I want to find directions to my desired location so I don’t get lost.
5. As a tourist / Singaporean / history enthusiast, I want to find a taxi, so that I can get to my desired location.
6. As a tourist / Singaporean / history enthusiast, I want to find food options near my current location or near location I will be visiting, so I can satisfy my hunger / food cravings as efficiently as possible.

B) Scope

Projection Complexity:

- Consume GET endpoint of API / consume geojson / kml file

  1. Taxi Availability API
  2. FourSquare API
  3. Historical Sites geojson file
  4. Heritage Trees geojson file
  5. Museums geojson file
  6. Tourist Attractions kml file

- Add / Remove DOM element based on user action

  1. On each tourist attraction marker click, update content of the tourist attraction in the side panel
  2. On each click of the nearby food icon in each marker popup, food results are updated
  3. On toggling the sort by dropdown from by relevance to by distance, food search results are reordered

- Modifying CSS of DOM elements based on user action

  1. Toggling Side Panel Open and close
  2. Toggling search view and directions view of the side panel
  3. Tooltips when hovering over buttons

- 1D traversal of array

  1. To add food markers to Search Query Layer
  2. To sort food search results

- CSS layout technique

  1. Flexbox

- Search or filtering criteria in the user interface

  1. Searching for map markers by keyword
  2. Search for food based on keyword
  3. Sort Food results based on distance

- Map updating based on user action

  1. Use leaflet layer control to toggle base and overlay map layers
  2. External button to toggle taxi availability
  3. External button to show user location with a marker and pop up
  4. Showing different markers with keyword search
  5. Showing directions when enter address into direction inputs

- Each layer group

  1. Heritage
  2. Tourist
  3. Historic
  4. Trees
  5. Food

- Each marker clustering group

  1. Taxi Availability Cluster

- Type of custom marker

  1. Each Layer group has a different coloured marker and unique icon

- Directions Functionality (Mapbox.js Directions Plugin)

- Food Recommendations Search Functionality (Foursquare Places API)

- Tourist Attraction Details Box (Data from tourist attraction kml file)

- Marker Pop Up Information from (Data from respective geojson, kml file)

- Use of model view controller
  - Data file: Functions to load and manipulate external data
  - View file: Function build the permanent map layers, and add them to the map
  - Helper file: Single purpose functions to help with manipulating DOM and CSS and adding and removing layers from the map
  - Script file: Manager file, Uses functions from all the files to render the overall application

UX / UI ( Structure, Skeleton, Features)

C) Structure

1. The main part of the web application is the interactive map

2. The side panel will allow the user access additional features based on the map
   a) Logo and Description
   b) Search Input Box
   - Map Markers Search Input
   - Nearby Food Search Input
     c) Directions Panel
   - Origin and Destination Inputs
   - Directions Details
     d) Search Results Panel
   - Tourist Attraction Info
   - Food Recommendations Results

D) Skeleton

- Screenshot

E) Surface

Choice of Colours:

- The application is multicoloured, as a colourful interface is shown to symbolise fun and playfulness, and informality.

  1. Navigation and control components

     - Directions input, location buttons and layer control box are blue as it is associated with control, safety and stability.

  2. Markers

     - Historic Sites: Dark Blue which symbolises depth and expertise
     - Heritage Trees: Green to fit the nature theme of this layer
     - Tourist Attractions: Orange as it communicates fun and playfulness
     - Musuems: Grey as it is the colour of formality and sophistication
     - Taxis: Yellow as it is very bright and stands out easily like taxis tend to do
     - Food: Red is known to evoke the tastebuds and stimulate appetite

  3. PopUps Content
     - Random dark colours to ensure their readability against the white popup background colour
     - The range of colours make reading the descriptions more interesting

Choice of Fonts:

- San Serif fonts are chosen are they enhance readability and look clean.
- This is important as the information stands out more to the user
- Specifically Helvetica Neue, Arial, Helvetica
