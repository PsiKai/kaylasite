import React, { useContext, useState, useMemo } from "react"
import { ArtworkContext } from "../context/ArtworkContext.js"

export default function Delete() {
  const { artWorks } = useContext(ArtworkContext)
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [activeArt, setActiveArt] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const subCategories = useMemo(() => {
    if (!category) return []

    const newSubCats = artWorks.reduce((categories, art) => {
      if (art.category !== category) return categories
      if (categories.has(art.subCategory)) return categories
      categories.add(art.subCategory)
      return categories
    }, new Set())

    return Array.from(newSubCats)
  }, [category])

  const thumbnails = useMemo(() => {
    if (!subCategory) return []

    return artWorks.reduce((thumbs, art) => {
      if (art.category !== category) return thumbs
      if (art.subCategory !== subCategory) return thumbs
      thumbs.push(art)
      return thumbs
    }, [])
  }, [subCategory, category])

  const updateActiveArt = _id => {
    if (_id === activeArt?._id) return setActiveArt(null)

    setActiveArt(artWorks.find(art => art._id === _id))
  }

  const updateSubCategory = e => {
    if (e.target.value === subCategory) return

    setActiveArt(null)
    setSubCategory(e.target.value)
  }

  const updateCategory = e => {
    if (e.target.value === category) return

    setActiveArt(null)
    setCategory(e.target.value)
  }

  const handleDeletion = async e => {
    e.preventDefault()
    setDeleting(true)
    try {
      const { src, thumbnail, _id } = activeArt
      const params = new URLSearchParams({ src, thumbnail, _id }).toString()
      await fetch("/api/artwork?" + params, { method: "DELETE" })
    } catch (err) {
      console.log(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleDeletion}>
      <ul>
        <li>
          <label htmlFor="medium">
            <p>
              <strong>Select Medium</strong>
            </p>
          </label>
        </li>
        <li>
          <div className="wrapper">
            <input
              id="photos"
              type="radio"
              name="medium"
              value="Photography"
              className="radio"
              required
              onChange={updateCategory}
            />
            <label htmlFor="photos" className="radio btn">
              Photography
            </label>
          </div>
          <div className="wrapper">
            <input
              id="paintings"
              type="radio"
              name="medium"
              value="Painting"
              className="radio"
              onChange={updateCategory}
            />
            <label htmlFor="paintings" className="radio btn">
              Painting
            </label>
          </div>
          <div className="wrapper">
            <input
              id="drawings"
              type="radio"
              name="medium"
              value="Drawing"
              className="radio"
              onChange={updateCategory}
            />
            <label htmlFor="drawings" className="radio btn">
              Drawing
            </label>
          </div>
          <div className="wrapper">
            <input
              id="digitals"
              type="radio"
              name="medium"
              value="Digital"
              className="radio"
              onChange={updateCategory}
            />
            <label htmlFor="digitals" className="radio btn">
              Digital
            </label>
          </div>
        </li>
        <li>
          <label htmlFor="subcat">
            <p>
              <strong>Subject Matter</strong>
            </p>
          </label>
        </li>
        <li>
          <div className="flex-container">
            {subCategories.map(subCat => (
              <React.Fragment key={subCat}>
                <input
                  id={subCat}
                  type="radio"
                  className="radio"
                  value={subCat}
                  onClick={updateSubCategory}
                  name="subcategories"
                />
                <label className="radio btn btn-sm sub" htmlFor={subCat}>
                  {subCat}
                </label>
              </React.Fragment>
            ))}
          </div>
        </li>
      </ul>
      <div className="thumbnail-container scrollbar scrollbar-deep-blue">
        <ul className="thumbnail-list">
          {thumbnails.map(({ _id, thumbnail }) => (
            <React.Fragment key={_id}>
              <img
                className={`thumbnail-image img ${activeArt?._id === _id ? "img-clicked" : ""}`}
                src={thumbnail}
                alt={thumbnail}
                onClick={() => updateActiveArt(_id)}
              />
            </React.Fragment>
          ))}
        </ul>
      </div>
      <label className="alert alert-danger hidden">
        <i className="fa fa-exclamation-circle" />
        <strong> Please select an artwork to update or delete!</strong>
      </label>
      <input type="text" id="imgDel" name="image" className="delete-img" />
      <label htmlFor="imgDel" className="btn btn-lg hidden del-label"></label>
      <button
        disabled={deleting || !activeArt}
        name="button"
        type="submit"
        className="btn btn-lg btn-danger"
      >
        <i className="fa fa-trash" />
        {deleting ? "Removing Artwork..." : "Remove Artwork"}
      </button>
      <label name="updateButton" className="btn btn-lg btn-success">
        <i className="far fa-edit" />
        Edit Artwork
        <i className="fas fa-angle-double-down hidden" />
      </label>
    </form>
  )
}
