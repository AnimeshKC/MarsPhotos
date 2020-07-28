import React, { useState, useEffect } from "react"

function getApiUrl(sol, cameraType, page) {
  const params = new URLSearchParams({
    sol: sol,
    camera: cameraType,
    page: page,
  })
  const url = `http://localhost:5000/api/photos?${params.toString()}`
  return url
}
export default function usePhotoSearch(
  sol,
  cameraType,
  page,
  photoRenderRequired,
  setPhotoRenderRequired
) {
  const [searchLoading, setSearchLoading] = useState(true)
  const [searchError, setSearchError] = useState("")
  const [photoData, setPhotoData] = useState([])
  const [hasMore, setHasMore] = useState(false)
  async function fetchPhotoData(url, nexturl) {
    try {
      const response = await fetch(url)
      const data = await response.json()
      setPhotoData([...photoData, ...data])
      const nextResponse = await fetch(nexturl)
      const nextData = await nextResponse.json()
      console.log(`Next data:`)
      console.log(nextData)
      nextData.length ? setHasMore(true) : setHasMore(false)
    } catch (e) {
      setSearchError(e.toString())
    }
  }

  useEffect(() => {
    console.log(photoRenderRequired)

    if (page !== null && photoRenderRequired) {
      async function executePhotoEffect() {
        try {
          setSearchLoading(true)
          const url = getApiUrl(sol, cameraType, page)
          const nextUrl = getApiUrl(sol, cameraType, page + 1)
          await fetchPhotoData(url, nextUrl)
          setPhotoRenderRequired(false) //after rendering
          setSearchLoading(false)
        } catch (e) {
          setSearchError(e.toString())
        }
      }

      executePhotoEffect()
    }
  }, [sol, cameraType, page, photoRenderRequired, setPhotoRenderRequired])
  console.log(`hasMore: ${hasMore}`)
  return { searchLoading, searchError, photoData, hasMore, setPhotoData }
}
