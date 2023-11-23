import React, { useRef } from "react"

export default function EditCarousel({ artworks, activeArt, onChange }) {
  const editCarouselScroll = useRef()

  const handleFocus = e => {
    const { offsetLeft, offsetWidth: imgWidth } = e.target.parentElement
    const { offsetWidth, scrollLeft, scrollWidth } = editCarouselScroll.current
    let scrollPosition = offsetLeft - (offsetWidth - imgWidth) / 2
    scrollPosition = Math.max(0, Math.min(scrollPosition, scrollWidth - offsetWidth))
    editCarouselScroll.current.scroll({
      left: scrollPosition,
      behavior: "smooth",
    })
  }

  return (
    <fieldset>
      <legend>
        <p>
          <strong>Select Artwork</strong>
        </p>
      </legend>
      <div className="thumbnail-container scrollbar scrollbar-deep-blue " ref={editCarouselScroll}>
        <div className="thumbnail-list">
          {artworks.map(({ _id, thumbnail, title }) => (
            <React.Fragment key={_id}>
              <label>
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
            </React.Fragment>
          ))}
        </div>
      </div>
    </fieldset>
  )
}
