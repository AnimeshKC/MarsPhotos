import { useState, useEffect } from "react"

function getApiUrl(sol, cameraType, page) {
  const params = new URLSearchParams({
    sol: sol,
    camera: cameraType,
    page: page,
  })
  const url = `/api/photos?${params.toString()}`
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

  useEffect(() => {
    async function fetchPhotoData(url, nexturl) {
      try {
        const response = await fetch(url)
        const data = await response.json()
        if (!Array.isArray(data)) throw new Error("data retrieval error")
        setPhotoData((prevData) => {
          //because of async complications, make sure the data is not duplicated
          const combinedArray = [...prevData, ...data]
          const idArray = [
            ...new Set(combinedArray.map((element) => element.id)),
          ]
          return idArray.map((id) =>
            combinedArray.find((element) => element.id === id)
          )
        })
        const nextResponse = await fetch(nexturl)
        const nextData = await nextResponse.json()
        nextData.length ? setHasMore(true) : setHasMore(false)
      } catch (e) {
        setSearchError("Photo Data could not be retrieved")
      }
    }
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
  }, [
    sol,
    cameraType,
    page,
    photoRenderRequired,
    setPhotoRenderRequired,
    photoData,
  ])
  return { searchLoading, searchError, photoData, hasMore, setPhotoData }
}
