require("dotenv").config()

const path = require("path")
const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const fetch = require("node-fetch")
const cors = require("cors")

app.use(express.json())
app.use(cors()) //this API shouldn't be restricted

const TIMEOUT_MS = 10000
app.use((req, res, next) => {
  res.setTimeout(TIMEOUT_MS, () => {
    res.status(408).send(`Timeout exceeded ${(TIMEOUT_MS / 1000).toFixed(1)}s`)
  })
  next()
})

/*
if a page of 0 is given, getPhotoUrl will show all results, 
but generally it is preferred to choose a page to reduce load time
*/
function getPhotoUrl(sol, cameraType = "any", page = 1) {
  const cameraString = cameraType === "any" ? "" : `&camera=${cameraType}`
  const apiKeyString = `&api_key=${process.env.NASA_API_KEY}`
  const pageString = page > 0 ? `&page=${page}` : ""
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}${pageString}${cameraString}${apiKeyString}`
  return url
}

function servePhotos(req, res) {
  const reqSol = req.query.sol
  const reqCamera = req.query.camera || "any"
  const reqPage = req.query.page || 1
  const apiUrl = getPhotoUrl(reqSol, reqCamera, reqPage)
  const testError = new Error("Test Error")
  fetch(apiUrl)
    .then((res) => res.json())
    .then((json) => {
      const photosArray = json.photos.map((element) => {
        return { id: element.id, img_src: element.img_src }
      })
      res.send(JSON.stringify(photosArray))
    })
    .catch((error) => res.send(error.toString()))
}

function getManifest(req, res) {
  const apiURL = `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/?api_key=${process.env.NASA_API_KEY}`
  fetch(apiURL)
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((error) => res.send(error.toString()))
}

app.get("/api/photos", servePhotos)
app.get("/api/manifest", getManifest)

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client.build"))
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"))
  })
}

app.listen(port)
