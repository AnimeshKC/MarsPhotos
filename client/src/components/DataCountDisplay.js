import React from "react"
import "./DataCountDisplay.css"
export default function DataCountDisplay(props) {
  const totalPhotos = props.totalPhotos
  const maxSol = props.maxSol

  return (
    <div className="dataCountContainer">
      <div className="dataCountText">{`Search among ${totalPhotos} photos!`}</div>
      <div className="dataCountText">{`Choose a sol (mission day) from 0 to ${maxSol}`}</div>
    </div>
  )
}
