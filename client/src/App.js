import React, { useState, useEffect } from "react"
import "./App.css"
import useForm from "./components/useForm"
import { isinRange } from "./utlity/isInRange"
import DataCountDisplay from "./components/DataCountDisplay"
function App() {
  const [roverFormValues, setRoverFormValues] = useForm({
    solNum: 0,
    cameraType: "any",
  })

  const [manifestData, setManifestData] = useState(null)

  useEffect(() => {
    async function getManifestData() {
      const response = await fetch(`http://localhost:5000/api/manifest`)
      const manifestData = await response.json()
      setManifestData(manifestData)
    }
    getManifestData()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    console.log(roverFormValues)
  }
  return (
    <div className="appContainer">
      <h1 className="appTitle">Mars Rover Photo Display</h1>
      {manifestData ? (
        <DataCountDisplay
          totalPhotos={manifestData.photo_manifest.totalPhotos}
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
