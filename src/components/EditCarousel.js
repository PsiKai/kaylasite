import React, { useRef, useContext, useState } from "react"
import useArtOrdering from "../hooks/useArtOrdering.js"
import { ArtworkContext } from "../context/ArtworkContext"
import LinkedList from "../../utils/LinkedList.js"
import useAlerts from "../hooks/useAlerts.js"

export default function EditCarousel({ artworks, activeArt, onChange }) {
  const { dispatch } = useContext(ArtworkContext)
  const [reordering, setReordering] = useState(false)
  const editCarouselScroll = useRef()
  const { setAlert } = useAlerts()

  const handleFocus = e => {
    const { offsetTop, offsetHeight: imgHeight } = e.target.parentElement
    const { offsetHeight, scrollHeight } = editCarouselScroll.current
    let scrollPosition = offsetTop - (offsetHeight - imgHeight) / 2
    scrollPosition = Math.max(0, Math.min(scrollPosition, scrollHeight - offsetHeight))
    editCarouselScroll.current.scroll({
      top: scrollPosition,
      behavior: "smooth",
    })
  }

  const handleArtReorder = async (itemId, neighborId) => {
    setReordering(true)
    const originalState = [...artworks.map(art => ({ ...art }))]
    try {
      const newList = new LinkedList(artworks)
      const artMoved = newList.moveListItem(itemId, neighborId)
      if (!artMoved) return

      dispatch({
        type: "REORDER_ART",
        payload: newList.entries,
      })
      const movedArt = originalState.find(art => art._id === itemId)
      const neighborArt = originalState.find(art => art._id === neighborId)
      const res = await fetch("/api/artwork", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movedArt, neighborArt }),
      })
      if (!res.ok) throw new Error("Error reordering artwork")
      // await new Promise((resolve, reject) => setTimeout(reject, 1000))
    } catch (error) {
      setAlert({ type: "danger", message: "There was an error reordering the artwork" })
      dispatch({
        type: "REORDER_ART",
        payload: originalState,
      })
    } finally {
      setReordering(false)
    }
  }

  const orderingProps = useArtOrdering(editCarouselScroll, handleArtReorder)

  return (
    <fieldset>
      <legend>
        <p>
          <strong>Select Artwork</strong>
        </p>
      </legend>
      <div className="thumbnail-container scrollbar scrollbar-deep-blue ">
        <h3 className="current-subcategory--header">{artworks[0].subCategory}</h3>
        <div
          className={`thumbnail-list edit-carousel ${reordering ? "drop-pending" : ""}`}
          ref={editCarouselScroll}
          {...orderingProps}
        >
          {artworks.map(({ _id, thumbnail, title }) => (
            <label key={_id} className="edit-carousel-item" data-dragid={_id}>
              <img
                className={`thumbnail-image img ${activeArt?._id === _id ? "img-clicked" : ""}`}
                src={thumbnail}
                alt={title}
              />
              <input
                type="radio"
                name="activeArt"
                className="radio"
                value={_id}
                checked={activeArt?._id === _id}
                onChange={() => onChange(_id)}
                onFocus={handleFocus}
              />
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  )
}
