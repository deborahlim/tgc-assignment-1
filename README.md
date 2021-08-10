# tgc-assignment-1

Project 1 SG Attractions & Heritage Map

1. Context

   - This project is a web application based on an interactive map of Singapore.
   - It provides to the user information about Singapore’s heritage sites and tourist attractions.
   - It also provides routing services and taxi transport information.
   - The application has search and sorting functionality, allowing the user to display specific map markers.
   - The application also makes use of an API to give the user food recommendations depending on user input.
   - External User Goals: To find interesting places to visit in Singapore, learn about Singapore’s heritage and find an app that shows me how to get to places of interest.
   - Organisation Goals: To give Singapore a distinctive and favourable identity in the map of the world and promote greater community ownership over Singaporeans’ shared heritage (according to SG Heritage Board & Centre for Liveable Cities)

2. Demo

   - A live website can be found here <LINK>
   - Screenshot

3. Defining the Project (Strategy, Scope)
   - Strategy
     - Site Owner / Organisational Goals
       - Increase awareness of and interest for historic sites and places of interest in Singapore
       - Increase Singapore’s attractiveness as a tourist destination
       - Promote F&B Businesses in Singapore
     - Identifying External Users
       - Tourists
       - History Enthusiasts
       - Singapore residents or anyone who is wants to know more about Singapore’s heritage and find interesting places in Singapore.
     - Identifying External Users’ Goals
       - To search for / find / get information about heritage sites in Singapore
       - To search for / find / get information attractions / interesting spots to visit
       - To search for places of interest near their location
     - User goals/ Stories
       - As a tourist / Singaporean / history enthusiast, I want to find out more information about heritage site / attractions so that I can decide when to visit / get more knowledge
       - As a tourist / Singaporean / history enthusiast, I want to see the heritage sites/ attractions near my location so that I do not make detours
       - As a tourist / Singaporean / history enthusiast, I want to filter the heritage site / attractions according to a keyword so that I can see only those that I am interested in
       - As a tourist / Singaporean / history enthusiast, I want to find directions to my desired location so I don’t get lost
       - As a tourist / Singaporean / history enthusiast, I want to find tourist attractions / historical sites / food near me so that I can visit them conveniently without making detours.
       - As a tourist / Singaporean / history enthusiast, I want to find a taxi, so that I can get to my desired location.
   - Scope
     - Projection Complexity
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
       - Functional mapping method
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
         5. Search Query layer
       - Each marker clustering group
         1. Taxi Availability Cluster Group
       - Type of custom marker
         - Each Layer group has a different coloured marker a unique icon
