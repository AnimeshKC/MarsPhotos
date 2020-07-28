# Chingu Solo Project — Tier 3 — Mars Rover Photo Display — by Animesh

[Deployed App][deployedApp]

## About the Project
This project relies on NASA's Mars Rover Photos API which can be found on their [API page][nasaAPIS]. The user can input a sol (mission day) and a camera type, and the program will display photos taken by the Mars Curiosity Rover.

The purpose of this app is to provide the user with a simple to use interface for finding pictures from NASA's Mars Rover API. 

### Technology Stack
React.js, Node.js, Express.js


## Features
* Responsive grid gallery
* Infinite Page scroll that triggers per 25 photos
* Client-side validation for sol numbers

## Error Handling and Edge Cases
* Appropriate Errors are shown if either the manifest data or the photo data cannot be retrieved from the server
* A timeout is initiated in the server if a request takes more than 10 seconds
* The Photo Gallery displays loading text if some of the photos have not yet loaded or if more photos are about to be loaded with infinite page scroll
* While the manifest data is loading, the form is prevented from being submitted

## Dependencies
This application requires the following npm packages: [cors][cors], [express][express], [nodefetch][nodefetch], and [dotenv][dotenv]
[deployedApp]: https://mars-photo-animesh.herokuapp.com/
[nasaAPIs]: https://api.nasa.gov/
[cors]: https://www.npmjs.com/package/cors
[express]: https://www.npmjs.com/package/express
[nodefetch]: https://www.npmjs.com/package/node-fetch
[dotenv]: https://www.npmjs.com/package/dotenv