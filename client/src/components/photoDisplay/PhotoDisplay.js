import React from "react"
import "./photoDisplay.css"
export default function PhotoDisplay({ photoData }) {
  const styleClass = photoData.length ? "photo" : "noPhotos"
  return (
    <div className={styleClass}>
      {photoData.length
        ? photoData.map((element) => {
            return (
              <img
                width="300px"
                height="300px"
                key={element.id}
                src={element.img_src}
              ></img>
            )
          })
        : "No photos found"}
    </div>
  )
}
