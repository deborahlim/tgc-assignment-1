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

Use Cases / Features

| <br>Use Case                                                                | <br>User Objective                                                                                                                                                                                                               | <br>Steps                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <br>Using the Get User Location & Taxi Availability Button<br> <br>         | <br>See current location on map<br> <br><br> <br>Get address of current location<br> <br><br> <br>Find a taxi near my location                                                                                                   | <br>1. Click on User Location Button. A marker will appear. <br> <br><br> <br>2. Hover over the marker to see current location. <br> <br><br> <br>3. Directions panel will appear and current latitude and longitude will be inside the directions origin input<br> <br><br> <br>4. Click on the Taxi Availability Button to see the available nearby taxis.<br> <br><br> <br>5. Click on a taxi maker to reveal the taxi’s location.<br> <br><br> <br>6. Zooming out the map will reveal the different group clusters. Red groups indicate a high number of taxis in that area, yellow groups indicate lesser taxis and green groups indicate very few taxis.<br> <br>                                                                                                                                                |
| <br>Toggling Map Layers (Base and Overlay) using the layer control box      | <br>View the the map of Singapore from a different perspective<br> <br><br> <br><br> <br>Explore the many heritage sites, heritage trees and tourist attractions, museums in Singapore                                           | <br>1. Layer Control Box is on the top right corner of the map<br> <br><br> <br>2. Hover over box to open.<br> <br><br> <br>3. For base layer, choose between street view, outdoor view and satellite view by clicking on each corresponding radio button<br> <br><br> <br>4. For Overlay Layer, tick the corresponding checkbox to show the corresponding markers on the map. Multiple layers can be chosen.                                                                                                                                                                                                                                                                                                                                                                                                          |
| <br>Exploring Map Markers                                                   | <br>Get information about heritage sites, tourist attractions, museums                                                                                                                                                           | <br>1. Click on map marker to open the pop up and view information about the place of interest<br> <br><br> <br>2. Click on the directions button in the pop up of each marker. The location will be put into the destination of the directions panel.<br> <br><br> <br>4. Click on the nearby food places button in the pop up to trigger food recommendations. These will appear as markers as well as in a list format in the side panel.<br> <br><br> <br>For tourist attraction markers only:<br> <br>5. More information about the attraction will appear in side panel when the marker is clicked.<br> <br> <br> <br>6. Click on the link to go to the attraction’s website<br> <br><br> <br>7. The directions button and nearby food button for that attraction can also be found in the side panel. <br> <br> |
| <br>Using the Directions / Routing Panel                                    | <br>Get to desired location                                                                                                                                                                                                      | <br>1. Click Get directions button in the pop ups (Or side panel for tourist attraction markers)<br> <br><br> <br>2. The marker’s location will be appear in the destination input of direction panel.<br> <br><br> <br>3. Both origin and destination inputs must be filled up before pressing enter.<br> <br><br> <br>4. Click on driving / cycling / walking button to show the routes for each mode of transport<br> <br><br> <br>5. Click on reverse icon in between the input boxes to reverse the origin and destination input.                                                                                                                                                                                                                                                                                 |
| <br>Using the Nearby Food Button & getting nearby food recommendations      | <br>Get food recommendations nearby current location<br> <br><br> <br>Get food recommendations nearby markers<br> <br><br> <br>Get food recommendations in a specific area                                                       | <br>1. Click the Explore nearby food button in the side panel<br> <br><br> <br>2. The recommendations will be limited to those with locations within the map view <br> <br><br> <br>3. Input a type of food or cuisine in the nearby food input box to specify the food type that you are interested in.<br> <br> <br> <br>4. Click the nearby food button in each marker pop up to get recommendations near that marker.<br> <br>                                                                                                                                                                                                                                                                                                                                                                                     |
| <br>Exploring Food Recommendations & Get Directions to food Recommendations | <br>Get the details of Food Recommendations<br> <br><br> <br>Sort Food Recommendations (For food Recommendations triggered by clicking the nearby food button in a marker pop up / attraction side panel only)<br> <br><br> <br> | <br>1. Hover over the food marker to see the name of the food recommendation<br> <br><br> <br>2. Click on the marker to get its location. The location will in input into the destination input of the directions panel. <br> <br><br> <br>3. More details of the food recommendation is shown in the side panel<br> <br><br> <br>4. Hover over each food result in the side panel to see the corresponding marker’s pop up<br> <br><br> <br>5. Click on the food result in the side panel to zoom into that marker on the map<br> <br><br> <br>6. Click the dropdown to sort the food results according to distance from the marker in question. The default will be sorted by relevance.                                                                                                                             |
| <br>Searching for Specific Markers                                          | <br>Find a specific place of interest                                                                                                                                                                                            | <br>1. Type in a key word.<br> <br><br> <br>2. Press enter or click the search button. Only map markers which contain the keyword will appear.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| <br>Searching for specific Foods                                            | <br>Find a specific type of food                                                                                                                                                                                                 | <br>1. Type in a keyword relating to food<br> <br><br> <br>2. Press enter or click the search button. <br> <br><br> <br>3. Option to sort results by distance or popularity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| <br>Using the clear button in the search input boxes                        | <br>Clear the markers in the map and information in the side panel                                                                                                                                                               | <br>1. Click the cross button in the marker search input box to clear the side panel and map markers<br> <br><br> <br>2. Click the cross button in the marker search input box to clear the food markers and side panel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
