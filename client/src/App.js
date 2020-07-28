import React, { useState, useEffect, useRef, useCallback } from "react"
import "./App.css"
import useForm from "./components/useForm"
import usePhotoSearch from "./components/usePhotoSearch"
import DataCountDisplay from "./components/DataCountDisplay"
import isInRange from "./utlity/isInRange"

const initialFormErrors = { solError: "" }
const initialRoverFormValues = { solNum: 0, cameraType: "any" }
const initialStates = {
  initialFormErrors,
  initialRoverFormValues,
  photoRenderRequired: false,
  manifestData: null,
  manifestError: "",
  pageNum: null,
}
function App() {
  //App state
  const [roverFormValues, setRoverFormValues] = useForm(
    initialStates.initialRoverFormValues
  )
  const [pageNum, setPageNum] = useState(initialStates.pageNum)
  const [formErrors, setFormErrors] = useState(initialStates.initialFormErrors)
  const [photoRenderRequired, setPhotoRenderRequired] = useState(
    initialStates.photoRenderRequired
  )
  const [manifestData, setManifestData] = useState(initialStates.manifestData)
  const [manifestError, setManifestError] = useState(
    initialStates.manifestError
  )
  const {
    searchLoading,
    searchError,
    photoData,
    hasMore,
    setPhotoData,
  } = usePhotoSearch(
    roverFormValues.solNum,
    roverFormValues.cameraType,
    pageNum,
    photoRenderRequired,
    setPhotoRenderRequired
  )

  //code to handle infinite page scrolling
  const observer = useRef()
  const lastPhotoRef = useCallback(
    (node) => {
      if (searchLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNum) => prevPageNum + 1)
          setPhotoRenderRequired(true)
        }
      })
      if (node) observer.current.observe(node)
    },
    [searchLoading, hasMore]
  )
  useEffect(() => {
    async function getManifestData() {
      try {
        const response = await fetch(`/api/manifest`)
        const manifestData = await response.json()
        if (!manifestData.photo_manifest)
          throw new Error("Manifest Data Retrieval Error")
        setManifestData(manifestData)
      } catch (e) {
        setManifestError("Manifest Data could not be retrieved")
      }
    }
    getManifestData()
  }, [])
  function validateState() {
    //this function is structured in case additional validation is needed in the future
    let isValid = true //true unless there's an error
    let solError = ""
    if (
      !isInRange(roverFormValues.solNum, 0, manifestData.photo_manifest.max_sol)
    ) {
      isValid = false
      solError = `sol value must be between 0 and ${manifestData.photo_manifest.max_sol}`
      setPageNum(null)
    }
    if (solError) setFormErrors({ ...formErrors, solError })
    return isValid
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!manifestData || !validateState()) return
    //at this point, there are no more errrors, so clear them
    setFormErrors(initialFormErrors)
    setPhotoData([]) //reset photo data upon each submit
    setPageNum(1)
    setPhotoRenderRequired(true)
  }
  function displayPhoto() {
    const styleClass = photoData.length ? "photoContainer" : "strongBolded"
    const messageString = searchLoading ? "" : "No photos found"
    return (
      <div className={styleClass}>
        {photoData.length
          ? photoData.map((element, index) => {
              const altString = `photo with id ${element.id}`
              if (photoData.length === index + 1) {
                return (
                  <img
                    width="300px"
                    height="300px"
                    ref={lastPhotoRef}
                    alt={altString}
                    key={element.id}
                    src={element.img_src}
                  ></img>
                )
              }
              return (
                <img
                  width="300px"
                  height="300px"
                  alt={altString}
                  key={element.id}
                  src={element.img_src}
                ></img>
              )
            })
          : messageString}
      </div>
    )
  }
  return (
    <div className="appContainer">
      <h1 className="appTitle">Mars Rover Photo Display</h1>
      {manifestData ? (
        <DataCountDisplay
          totalPhotos={manifestData.photo_manifest.total_photos}
          maxSol={manifestData.photo_manifest.max_sol}
        />
      ) : manifestError ? (
        "CANNOT RETRIEVE DATA"
      ) : (
        "...loading"
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
          <div className="buttonContainer">
            <button className="buttonInstance" type="submit">
              Find Photos
            </button>
          </div>
        </form>
        <div className="strongBolded redText"> {searchError} </div>
        <div className="strongBolded redText">{manifestError}</div>
      </div>
      {!searchError && photoData && pageNum !== null ? displayPhoto() : ""}
      <div className="strongBolded">
        {searchLoading && pageNum && "...Loading"}
      </div>
    </div>
  )
}

export default App
