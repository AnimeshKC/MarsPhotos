import React, { useState, useEffect } from "react"
import "./App.css"
import useForm from "./components/useForm"
function App() {
  const [roverFormValues, setRoverFormValues] = useForm({
    solNum: 0,
    cameraType: "any",
  })
  const [dataCount, setDataCount] = useState({
    totalPhotos: null,
    maxSol: null,
  })
  function getDataCountFromManifest(manifestData) {
    const photoManifest = manifestData.photo_manifest
    return {
      maxSol: photoManifest.max_sol,
      totalPhotos: photoManifest.total_photos,
    }
  }
  const [manifestData, setManifestData] = useState({})

  useEffect(() => {
    async function getManifestData() {
      const response = await fetch(`http://localhost:5000/api/manifest`)
      const manifestData = await response.json()
      setManifestData(manifestData)
      setDataCount(getDataCountFromManifest(manifestData))
    }
    getManifestData()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    //console.log(roverFormValues)
  }
  return (
    <div className="appContainer">
      <h1 className="appTitle">Mars Rover Photo Display</h1>
      <div>
        {dataCount.totalPhotos
          ? `Search among ${dataCount.totalPhotos} photos!`
          : ""}
      </div>
      <div>
        {dataCount.maxSol ? `Choose an sol from 0 to ${dataCount.maxSol}` : ""}
      </div>

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
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default App
