import React from "react"

export default function PhotoDisplay({ photoData }) {
  return (
    <div>
      {photoData.map((element) => {
        return <img key={element.id} src={element.img_src}></img>
      })}
    </div>
  )
}
