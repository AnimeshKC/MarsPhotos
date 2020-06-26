require("dotenv").config()

const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const fetch = require("node-fetch")
app.listen(port, () => console.log(`Server Started on port ${port}`))

app.use(express.json())

function getUrl(sol, cameraType = "any", page = 1) {
  const cameraString = cameraType === "any" ? "" : `&camera=${cameraType}`
  const apiKeyString = `&api_key=${process.env.NASA_API_KEY}`
  const pageString = page > 0 ? `&page=${page}` : ""
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}${pageString}${cameraString}${apiKeyString}`
  return url
}
async function servePhotos(req, res) {
  try {
    const reqSol = req.query.sol
    const reqCamera = req.query.camera || "any"
    const reqPage = req.query.page || 1
    const apiUrl = getUrl(reqSol, reqCamera, reqPage)
    fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => res.send(json))
  } catch (e) {
    console.log(`Error: ${e.message}`)
  }
}
app.get("/api/photos", servePhotos)
app.get("/", (req, res) => {
  const cameraString = `&camera=fhaz`
  const apiKeyString = `&api_key=${process.env.NASA_API_KEY}`
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=0${cameraString}${apiKeyString}`
  res.send(`${url}`)
})
