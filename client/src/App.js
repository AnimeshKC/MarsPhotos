import React from "react"
import "./App.css"
import useForm from "./components/useForm"
function App() {
  const [roverFormValues, setRoverFormValues] = useForm({
    solNum: 0,
    cameraType: "any",
  })

  //const [camera, setCamera] = useForm("All Cameras")
  return (
    <div className="appContainer">
      <h1 className="appTitle">Mars Rover Photo Display</h1>
      <h2 className="roverTitle">Curiosity Rover</h2>
      <div className="appFormContainer">
        <span>Sol</span>
        <form>
          <input
            type="number"
            name="solNum"
            value={roverFormValues.solNum}
            onChange={setRoverFormValues}
          ></input>
        </form>
        <span>Camera</span>
        <form>
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
        </form>
      </div>
    </div>
  )
}

export default App
