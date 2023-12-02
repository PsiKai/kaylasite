import React, { useRef } from "react"
import useArtOrdering from "../hooks/useArtOrdering.js"

export default function EditCarousel({ artworks, activeArt, onChange }) {
  const editCarouselScroll = useRef()

  const handleFocus = e => {
    const { offsetTop, offsetHeight: imgHeight } = e.target.parentElement
    const { offsetHeight, scrollTop, scrollHeight } = editCarouselScroll.current
    let scrollPosition = offsetTop - (offsetHeight - imgHeight) / 2
    scrollPosition = Math.max(0, Math.min(scrollPosition, scrollHeight - offsetHeight))
    editCarouselScroll.current.scroll({
      top: scrollPosition,
      behavior: "smooth",
    })
  }

  const orderingProps = useArtOrdering(editCarouselScroll)

  return (
    <fieldset>
      <legend>
        <p>
          <strong>Select Artwork</strong>
        </p>
      </legend>
      <div className="thumbnail-container scrollbar scrollbar-deep-blue ">
        <h3 className="current-subcategory--header">{artworks[0].subCategory}</h3>
        <div className="thumbnail-list edit-carousel" ref={editCarouselScroll} {...orderingProps}>
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
