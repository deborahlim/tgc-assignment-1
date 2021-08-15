# TGC13 Project 1 SG Attractions & Heritage Map

## Context

This project is a web application based on an interactive map of Singapore’s Attractions and Heritage Sites.

**It provides to the user:**

1. Information about Singapore’s heritage sites and tourist attractions, including museums, historic sites and heritage trees.
2. Routing services and directions to locations
3. Taxi transport information as a transport option
4. Search and sorting functionality, allowing the user to display specific map markers.
5. Food recommendations based on user location, map view and map markers, and user input

**External User Goals:**
To find interesting places to visit in Singapore, learn about Singapore’s heritage and find an app that shows me how to get to such places

**Organisation Goals:**
To give Singapore a distinctive and favourable identity in the map of the world and promote greater community ownership over Singaporeans’ shared heritage (according to SG Heritage Board & Centre for Liveable Cities)

## Demo

A live website can be found here <LINK>

<br>
<img width="1427" alt="Screenshot 2021-08-15 at 3 42 00 PM" src="https://user-images.githubusercontent.com/84578312/129470977-9a190315-a4f8-4730-a2b3-c032906c22b9.png">

## Defining the Project (Strategy, Scope)

### A) Strategy

**Site Owner / Organisational Goals:**

1. Increase awareness of and interest for historic sites, museums and tourist attractions in Singapore
2. Increase Singapore’s attractiveness as a tourist destination
3. Promote F&B Businesses in Singapore

**Identifying External Users:**

1. Tourists
2. History Enthusiasts
3. Singapore residents
4. Anyone wanting to learn about Singapore’s heritage
5. Anyone wanting to find interesting places in Singapore

**Identifying External Users’ Goals:**

1. To search for heritage sites / tourist attractions in Singapore
2. To get information about heritage sites / tourist attractions in SG
3. To get directions to reach heritage sites / tourist attractions in SG
4. To explore food options near their location or near attractions / heritage sites

**Identifying Pain Points**

1. Tourists only have a limited time in Singapore and want to visit as many tourist / interesting spots as possible
2. Tourists are not familiar with Singapore and get lost easily
3. Tourist / User do not want to travel far from their location for food

**User goals/ Stories:**

1. As a tourist / Singaporean / history enthusiast, I want to find out more information about heritage site / attractions so that I can decide when to visit / get more knowledge.
2. As a tourist / Singaporean / history enthusiast, I want to find tourist attractions / historical sites / food near my current location so that I can visit them conveniently without making detours.
3. As a tourist / Singaporean / history enthusiast, I want to filter the heritage site / attractions according to a keyword so that I can see only those that I am interested in.
4. As a tourist / Singaporean / history enthusiast, I want to find directions to my desired location so I don’t get lost.
5. As a tourist / Singaporean / history enthusiast, I want to find a taxi, so that I can get to my desired location.
6. As a tourist / Singaporean / history enthusiast, I want to find food options near my current location or near location I will be visiting, so I can satisfy my hunger / food cravings as efficiently as possible.

### B) Scope

**Projection Complexity:**

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
  4. Description of location in popup when user clicks the popup

- Modifying CSS of DOM elements based on user action

  1. Toggling Side Panel Open and close
  2. Toggling search view and directions view of the side panel
  3. Tooltips when hovering over buttons

- 1D traversal of array

  1. To add food markers to Search Query Layer
  2. To sort food search results

- Use of filtering method

  1. To filter which map markers to be displayed

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
  6. Zooming to marker and opening pop up when user click on food search result
  7. Closing fod pop up when user move mouse out of search result

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

- Strategy for Mobile Responsiveness (refer to testing cases for more details)
  - Side Panel can be toggled closed or open
  - Side Panel width will be different

## UX / UI ( Structure, Skeleton, Features)

### C) Structure & Skeleton

<img width="1438" alt="Screenshot 2021-08-15 at 3 44 21 PM" src="https://user-images.githubusercontent.com/84578312/129471027-87af0b32-2ac9-4419-af92-f285204a0df9.png">
</br>
**The application is made up of 2 main parts**

1. Interactive map

- Control Box on the top right of the map to toggle the base and overlay layers of the map

2. Side panel (3 sections)

- Logo and Description

  - Context of the Map

- Main Navigation Buttons
  - Toggle Taxi Availability
  - Get User Location
  - Explore Nearby Food
  - Toggle between search and directions views
- Input and Results Section (2 views which can be switched)

  - Search View

    - Search Input Box
      - Map Markers Search Input (To search map markers by keyword)
      - Nearby Food Search Input (To search for a specific food)
    - Search Results
      - Tourist Attraction Details (To see details about a tourist attraction marker)
      - Food Recommendations Results (To see details about the food markers)

  - Directions View
    - Directions Input (To put in origin and detination loction)
    - Route Options (Options of different mode of transport)
    - Route Instructions (Step by Step instructions to get to destination)

### D) Surface

**Choice of Colours:**

- The application is multicoloured, as a colourful interface is shown to symbolise fun and playfulness, and informality.

  1. Logo is multicoloured on hover

  2. Navigation and control components

     - Directions input, location buttons and layer control box are blue as it is associated with control, safety and stability.

  3. Markers

     - Historic Sites: Dark Blue which symbolises depth and expertise
     - Heritage Trees: Green to fit the nature theme of this layer
     - Tourist Attractions: Orange as it communicates fun and playfulness
     - Musuems: Grey as it is the colour of formality and sophistication
     - Taxis: Yellow as it is very bright and stands out easily like taxis tend to do
     - Food: Red is known to evoke the tastebuds and stimulate appetite

  4. PopUps Content
     - Random dark colours to ensure their readability against the white popup background colour
     - The range of colours make reading the descriptions more interesting

**Choice of Fonts:**

- San Serif fonts are chosen are they enhance readability and look clean.
- This is important as the information stands out more to the user
- Specifically Helvetica Neue, Arial, Helvetica

## Use Cases / Features

| Use Case                                                                | User Objective                                                                                                                                                                                                      | Steps                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Using the Get User Location & Taxi Availability Button<br> <br>         | See current location on map<br><br>Get address of current location<br> <br>Find a taxi near my location                                                                                                             | 1. Click on User Location Button. A marker will appear. <br><br> <br>2. Hover over the marker to see current location. <br> <br>3. Directions panel will appear and current latitude and longitude will be inside the directions origin input<br> <br>4. Click on the Taxi Availability Button to see the available nearby taxis.<br> <br>5. Click on a taxi maker to reveal the taxi’s location.<br><br>6. Zooming out the map will reveal the different group clusters. Red groups indicate a high number of taxis in that area, yellow groups indicate lesser taxis and green groups indicate very few taxis.<br> <br>                                                                                                                                           |
| Toggling Map Layers (Base and Overlay) using the layer control box      | View the the map of Singapore from a different perspective<br><br>Explore the many heritage sites, heritage trees and tourist attractions, museums in Singapore                                                     | 1. Layer Control Box is on the top right corner of the map<br><br>2. Hover over box to open.<br> <br>3. For base layer, choose between street view, outdoor view and satellite view by clicking on each corresponding radio button<br> <br>4. For Overlay Layer, tick the corresponding checkbox to show the corresponding markers on the map. Multiple layers can be chosen.                                                                                                                                                                                                                                                                                                                                                                                       |
| Exploring Map Markers                                                   | Get information about heritage sites, tourist attractions, museums                                                                                                                                                  | 1. Click on map marker to open the pop up and view information about the place of interest<br> <br>2. Click on the directions button in the pop up of each marker. The location will be put into the destination of the directions panel.<br> <br>4. Click on the nearby food places button in the pop up to trigger food recommendations. These will appear as markers as well as in a list format in the side panel.<br> <br>For tourist attraction markers only:<br> <br>5. More information about the attraction will appear in side panel when the marker is clicked.<br><br>6. Click on the link to go to the attraction’s website<br> <br>7. The directions button and nearby food button for that attraction can also be found in the side panel. <br> <br> |
| <br>Using the Directions / Routing Panel                                | Get to desired location                                                                                                                                                                                             | 1. Click Get directions button in the pop ups (Or side panel for tourist attraction markers)<br> <br>2. The marker’s location will be appear in the destination input of direction panel.<br><br>3. Both origin and destination inputs must be filled up before pressing enter.<br> <br>4. Click on driving / cycling / walking button to show the routes for each mode of transport<br> <br>5. Click on reverse icon in between the input boxes to reverse the origin and destination input.                                                                                                                                                                                                                                                                       |
| Using the Nearby Food Button & getting nearby food recommendations      | Get food recommendations nearby current location<br> <br>Get food recommendations nearby markers<br> <br><br>Get food recommendations in a specific area                                                            | 1. Click the Explore nearby food button in the side panel<br> <br>2. The recommendations will be limited to those with locations within the map view <br> <br>3. Input a type of food or cuisine in the nearby food input box to specify the food type that you are interested in.<br> <br>4. Click the nearby food button in each marker pop up to get recommendations near that marker.<br> <br>                                                                                                                                                                                                                                                                                                                                                                  |
| Exploring Food Recommendations & Get Directions to food Recommendations | Get the details of Food Recommendations<br> <br>Sort Food Recommendations (For food Recommendations triggered by clicking the nearby food button in a marker pop up / attraction side panel only)<br> <br><br> <br> | 1. Hover over the food marker to see the name of the food recommendation<br> <br>2. Click on the marker to get its location. The location will in input into the destination input of the directions panel. <br> <br>3. More details of the food recommendation is shown in the side panel<br> <br>4. Hover over each food result in the side panel to see the corresponding marker’s pop up<br> <br>5. Click on the food result in the side panel to zoom into that marker on the map<br> <br>6. Click the dropdown to sort the food results according to distance from the marker in question. The default will be sorted by relevance.                                                                                                                           |
| Searching for Specific Markers                                          | Find a specific place of interest                                                                                                                                                                                   | 1. Type in a key word.<br><br>2. Press enter or click the search button. Only map markers which contain the keyword will appear.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Searching for specific Foods                                            | Find a specific type of food                                                                                                                                                                                        | 1. Type in a keyword relating to food<br> <br>2. Press enter or click the search button. <br><br>3. Option to sort results by distance or popularity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Using the clear button in the search input boxes                        | Clear the markers in the map and information in the side panel                                                                                                                                                      | 1. Click the cross button in the marker search input box to clear the side panel and map markers<br> <br>2. Click the cross button in the marker search input box to clear the food markers and side panel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

## Testing

The numbering in the test steps corresponds to the numbering in the expected results

| <br>Test Case Number | <br>Test Case Description                                                           | <br>Test Steps                                                                                                                                                                                                                                                                                                                                               | <br>Expected Results                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <br>1.               | <br>Testing Mobile Responsiveness                                                   | <br>Assumption: Developer Tools is open<br> <br>1. Activate the toggle device tool bar in the developer tools<br> <br>2. Choose the screen size 411\*711 <br> <br>3. Choose responsive and toggle the screen size.                                                                                                                                           | 2. Side Panel width should be 85% of screen width.<br><br> <br>3. All elements in the sidebar do not overflow the side panel. Font sizes are proportionate to the screen size. Paddings and margin are smaller for smaller screen size and larger for larger screen sizes.<br>For all screen sizes, the whole side panel should be visible to the user. All elements in the side panel should be visible.<br> <br>Depending on the viewport width, the width of the Side panel should be different.<br> <br>- Extra Small screens( max-width 375px): 85% of viewport width<br> <br>- Small screens(max-width 540px): 90% of viewport width<br> <br>- Medium medium (max-width 768px): 60% of viewport width<br> <br>- Large screens(max-width 1024px): 45% of viewport width<br> <br>- Extra Large Screens (max-width 1366px): 35% of viewport width<br> <br>- XXL Screens (min-width: 1367px): 25% of viewport width |
| <br>2.               | <br>Testing User Interaction Responsiveness of the Side Panel                       | <br>1. Hover over the buttons in the Side Panel<br> <br>2. Click the collapse side panel button <br> <br>3. Click the expand side panel button                                                                                                                                                                                                               | <br>1. Tool Tips should appear when hovering over the buttons.<br> <br>2. Side Panel Should Close<br> <br>3. Side Panel Should Expand                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| <br>3.               | <br>Testing User Interaction Responsiveness of the Side Panel Content               | <br>Assumptions: Side panel view is on search view not directions view<br> <br>1. Click the Get Directions Button<br> <br>2. Click the Search Button Button<br> <br>3. Click on Get User Location Button<br> <br>4. Click yes to the prompt<br> <br>5. Hover over marker.                                                                                    | <br>1. Side Panel should switch to Directions View and the icon and tooltip should become a search button. <br> <br>2.Side Panel should switch back to Search View and the the icon and tooltip will change to directions.<br> <br>3. Prompt will appear ask user to enable location. <br> <br>4. A marker will appear at the user location. Map view will zoom into the marker. Side Panel is switched to Direction View and user lat & lng is in the origin input box.<br> <br>5. User Location Appears in a pop up box<br> <br><br> <br><br> <br>                                                                                                                                                                                                                                                                                                                                                                  |
| <br>4.               | <br>Testing Functionality of Search input boxes within the Side panel               | <br>1. Enter a “Marina Barrage” into the search map markers input box. Press the search button or press enter<br> <br>2. Click on the cross button in the markers search box<br> <br>3. Enter “Pizza” into the food search input box<br> <br>4. Click on the cross button in the food search input box                                                       | <br>1. The marina barrage marker appears. And the Map view moves to the marker<br> <br>2. The map markers are cleared and any information in the side panel is cleared<br> <br>3. Not more than 30 food markers relating to pizza keyword appears.<br> <br>4. Food markers and results in side panel are cleared.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| <br>5.               | <br>Testing User interaction Responsiveness of Map markers                          | <br>Assumption: At least 1 Overlay Map layer is activated. Either by checking the Overlay checkboxes in the Map Layer control or searching for markers in the marker search input.<br> <br><br> <br>1. Click on map marker (except heritage trees)<br> <br>2. Click marker again<br> <br>3.Hover over heritage tree marker                                   | <br>1.Pop Up Opens<br> <br>2.Pop Up closes<br> <br>3. Pop Up opens<br> <br>Content of the pop ups do not overflow the pop up. If there is no picture available, the size of the pop up shrinks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <br>6.               | <br>Testing Functionality of the Buttons in Marker pop up                           | <br>Assumption 1: At least 1 Overlay Map layer is activated. Either by checking the Overlay checkboxes in the Map Layer control or searching for markers in the marker search input.<br> <br><br> <br>Assumption 2: Side panel view is on search <br> <br><br> <br>1. Click on the Get directions button<br> <br>2. Click on the Nearby Food Button<br> <br> | <br>1. Side Panel switches to direction view, and lat lng of marker in question is in the destination input box.<br> <br>2. Side Panel switched to the search view. And not more than 30 food markers near the marker appears. A list of food results corresponding to the food markers appear in the side panel.<br> <br><br> <br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| <br>7.               | <br>Testing Functionality of the Food Results in Side Panel and Food Markers in Map | <br>Assumption 1: Nearby Food Button in pop up has been clicked<br> <br>Assumption 2: Side panel view is on search <br> <br>1. Hover over a food recommendation in the side panel<br> <br>2. Hover over a food marker.<br> <br>3. Click a food marker                                                                                                        | <br>1. A pop up containing the corresponding name opens above the corresponding marker<br> <br>2. The corresponding pop up appears<br> <br>3. Side panel is switched to directions view. The Lat lng of the marker is in the destination input box                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| <br>8.               | <br>Testing functionality of Sorting of Food Recommendations in Side panel          | <br>Assumption 1: Nearby Food Button in pop up has been clicked<br> <br>1. In the side panel, select sort by distance from the dropdown<br> <br>2. Select sort by relevance                                                                                                                                                                                  | <br>1. The results are arranged by distance. This can be seen by the distance away from marker of the first result being the lowest and the last result being the largest <br> <br>2. The results are arranged by in their original order as the default is to sort by relevance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| <br>9.               | <br>Testing functionality of Nearby Food Button in Side Panel                       | <br>1. Click the blue Nearby Food Button<br> <br><br> <br>                                                                                                                                                                                                                                                                                                   | <br>1. Not more than 30 food markers depending on the centre of the map view.<br> <br>Nearby Food Search not tied to the location of a marker should not have sorting functionality. There will be no distance information for these food recommendations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Technologies Used

- HTML
- CSS
- Javascript
- Mapbox.js

  - URL: https://docs.mapbox.com/mapbox.js/api/v3.3.1/

    - Mapbox Tiles

      - URL: https://www.mapbox.com/maps/streets
      - Used to implement base layers for the map (view.js line 345)

    - Mapbox-directions.js

      - URL: https://docs.mapbox.com/mapbox.js/example/v1.0.0/mapbox-directions/
      - Used to implement directions control box (view.js line 320)

    - Mapbox Geocoder

      - URL: https://docs.mapbox.com/mapbox.js/api/v3.3.1/l-mapbox-geocoder/
      - Used for reverse geocoding to get current user address and taxis’ addresses(script.js line 103 & 186)

    - Mapbox Omnivore

      - URL: https://docs.mapbox.com/mapbox.js/example/v1.0.0/markers-from-csv/
      - Used to convert tourist attraction kml file to geojson (view.js line 175)

    - Leaflet Mapbox Markercluster Plugin
      - URL: https://docs.mapbox.com/mapbox.js/example/v1.0.0/leaflet-markercluster/
      - Used to create taxi availability marker cluster group (script.js line 5)

- Four square API

  - URL: https://developer.foursquare.com/docs/places-api/
  - Used to get food recommendations (data.js line 2)

- Real Time Taxi Availability API
  - URL: https://data.gov.sg/dataset/taxi-availability
  - Used to get live latitude longitude locations of taxis in Singapore (data.js line 24)
- Markdown Table generator
  - URL: https://www.tablesgenerator.com/markdown_tables
  - Used in readme file to generate use cases and testing table
- Font Awesome Icons
  - URL: https://fontawesome.com/v5.15/icons?d=gallery&p=1
  - Used for all the icons in the application

## Credits

- Data Sets

  - https://data.gov.sg/dataset/heritage-trees
  - https://data.gov.sg/dataset/museums
  - https://data.gov.sg/dataset/tourist-attractions
  - https://data.gov.sg/dataset/historic-sites

- Function to generate dark colours
  - URL: https://gist.github.com/Chak10/dc24c61c9bf2f651cb6d290eeef864c1
  - Used to generate random dark colours for popup content (helpers.js line 81)
- jQuery usage to click inside popup and do javascript
  - URL: https://stackoverflow.com/questions/13698975/click-link-inside-leaflet-popup-and-do-javascript
  - Idea for how to implement functionality of buttons inside popups (helpers.js line 445)
- To register input content programmatically
  - https://stackoverflow.com/questions/35659430/how-do-i-programmatically-trigger-an-input-event-without-jquery
  - Used because directions control did not register the lat lng programmatically inputted into input box with Javascript (script.js line 111, helpers.js line 214)
- Box sizing reset best practice
  - URL: https://css-tricks.com/box-sizing/
- Responsiveness screenshot for readme file
  - http://ami.responsivedesign.is/#

## Deployment
