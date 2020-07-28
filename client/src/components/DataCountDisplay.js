import React from "react"

export default function DataCountDisplay(props) {
  const totalPhotos = props.totalPhotos
  const maxSol = props.maxSol

  return (
    <>
      <div>{`Search among ${totalPhotos} photos!`}</div>
      <div>{`Choose a sol (mission day) from 0 to ${maxSol}`}</div>
    </>
  )
}
