import React, { useState, useEffect } from "react"
import "./App.css"
import useForm from "./components/useForm"
import DataCountDisplay from "./components/DataCountDisplay"
import PhotoDisplay from "./components/PhotoDisplay"
import isInRange from "./utlity/isInRange"

const initialErrors = { solError: "" }
function App() {
  const [roverFormValues, setRoverFormValues] = useForm({
    solNum: 0,
    cameraType: "any",
  })
  const [formErrors, setFormErrors] = useState(initialErrors)

  const [manifestData, setManifestData] = useState(null)
  const [photoData, setPhotoData] = useState(null)
  useEffect(() => {
    async function getManifestData() {
      const response = await fetch(`http://localhost:5000/api/manifest`)
      const manifestData = await response.json()
      setManifestData(manifestData)
    }
    getManifestData()
  }, [])
  async function fetchPhotoData(url) {
    const response = await fetch(url)
    const data = await response.json()
    setPhotoData(data)
  }
  function validateState() {
    //this function is structured in case additional validation is needed in the future
    let isValid = true //true unless there's an error
    let solError = ""
    if (
      !isInRange(roverFormValues.solNum, 0, manifestData.photo_manifest.max_sol)
    ) {
      isValid = false
      solError = `sol value must be between 0 and ${manifestData.photo_manifest.max_sol}`
    }
    console.log(`solError: ${solError}`)
    if (solError) setFormErrors({ ...formErrors, solError })
    console.log(formErrors)
    return isValid
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (!manifestData || !validateState()) return //handle submit does nothing until manifestData has loaded
    //at this point, errors have been solved, so clear the errors
    setFormErrors(initialErrors)
    const pageNum = 1
    const params = new URLSearchParams({
      sol: roverFormValues.solNum,
      camera: roverFormValues.cameraType,
      page: pageNum,
    })
    const url = `http://localhost:5000/api/photos?${params.toString()}`
    fetchPhotoData(url)
  }
  return (
    <div className="appContainer">
      <h1 className="appTitle">Mars Rover Photo Display</h1>
      {manifestData ? (
        <DataCountDisplay
          totalPhotos={manifestData.photo_manifest.total_photos}
          maxSol={manifestData.photo_manifest.max_sol}
        />
      ) : (
        ""
      )}
      <h2 className="roverTitle">Curiosity Rover</h2>
      <div className="appFormContainer">
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label>Sol</label>
            </div>
            <input
              type="number"
              name="solNum"
              value={roverFormValues.solNum}
              onChange={setRoverFormValues}
            ></input>
            <div style={{ color: "red" }}>{formErrors.solError}</div>
          </div>
          <div>
            <div>
              <label>Camera</label>
            </div>
            <select
              name="cameraType"
              value={setRoverFormValues.cameraType}
              onChange={setRoverFormValues}
            >
              <option value="any"> Any Camera</option>
              <option value="fhaz">Front Hazard Avoidance Camera</option>
              <option value="rhaz"> Rear Hazard Avoidance Camera</option>
              <option value="mast">Mast Camera</option>
              <option value="chemcam">Chemistry and Camera Complex</option>
              <option value="mahli">Mars Hand Lens Imager</option>
              <option value="mardi">Mars Descent Imager</option>
              <option value="navcam">Navigation Camera</option>
            </select>
          </div>
          <button type="submit">Find Photos</button>
        </form>
      </div>

      {/* <div>
        {(manifestData &&
          isInRange(
            roverFormValues.solNum,
            0,
            manifestData.photo_manifest.max_sol
          )) ||
          "Sol is not in the proper range"}
      </div> */}

      {photoData ? <PhotoDisplay photoData={photoData} /> : ""}
    </div>
  )
}

export default App
