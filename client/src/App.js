import React, { useState, useEffect, useRef, useCallback } from "react"
import "./App.css"
import useForm from "./components/useForm"
import usePhotoSearch from "./components/usePhotoSearch"
import DataCountDisplay from "./components/DataCountDisplay"
import isInRange from "./utlity/isInRange"
import Footer from "./components/Footer"
import Spinner from "./components/Spinner"

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
          //if manifestData is undefined, an
          //object without photo_manifest, or not an object, this will throw an error
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
      roverFormValues.solNum === "" ||
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
    //submit does nothing before the manifestData has loaded
    //in the case of improper validation, some render divs will take care of displaying the error
    if (!manifestData || !validateState()) return
    //at this point, there are no more errrors, so clear them
    setFormErrors(initialFormErrors)
    setPhotoData([]) //reset photo data upon each submit
    setPageNum(1)
    setPhotoRenderRequired(true)
  }
  function displayPhoto() {
    const styleClass = photoData.length ? "photoContainer" : "noPhotos"
    const messageString = searchLoading ? "" : "No photos found"
    return (
      <div className={styleClass}>
        {photoData.length
          ? photoData.map((element, index) => {
              const altString = `photo with id ${element.id}`
              if (photoData.length === index + 1) {
                return (
                  <img
                    className="photo"
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
    <div className="pageContainer">
      <div className="siteContent">
        <div className="textAndFormContainer">
          <div className="introductionContainer">
            <header>
              <h1 className="appTitle">Mars Rover Photos</h1>
            </header>
            {manifestData ? (
              <DataCountDisplay
                totalPhotos={manifestData.photo_manifest.total_photos}
                maxSol={manifestData.photo_manifest.max_sol}
              />
            ) : manifestError ? (
              "CANNOT RETRIEVE DATA"
            ) : (
              // "...LOADING Manifest Data"
              <Spinner />
            )}
          </div>

          <div className="appFormContainer">
            <h2 className="roverTitle">Curiosity Rover</h2>

            <form onSubmit={handleSubmit} className="form">
              <label htmlFor="sol">Sol:</label>
              <input
                className="formElements"
                type="number"
                name="solNum"
                value={roverFormValues.solNum}
                onChange={setRoverFormValues}
                id="sol"
              ></input>
              <div className="redText smallText">{formErrors.solError}</div>
              <label htmlFor="camera">Camera:</label>
              <select
                className="formElements"
                name="cameraType"
                id="camera"
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
              <div className="buttonContainer">
                <button className="buttonInstance formElements" type="submit">
                  Find Photos
                </button>
              </div>
            </form>
          </div>
          <div className="strongBolded redText"> {searchError} </div>
          <div className="strongBolded redText">{manifestError}</div>
        </div>
        {!searchError && photoData && pageNum !== null ? displayPhoto() : ""}
        <div className="strongBolded">
          {searchLoading && pageNum && <Spinner />}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
