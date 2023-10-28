import React, { useContext, useState, useMemo } from "react"
import { ArtworkContext } from "../context/ArtworkContext.js"

export default function Delete() {
  const { artWorks, dispatch } = useContext(ArtworkContext)
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [activeArt, setActiveArt] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const updateActiveArt = _id => {
    if (_id === activeArt?._id) return setActiveArt(null)

    setActiveArt(artWorks[category][subCategory].find(art => art._id === _id))
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
      const { _id } = activeArt
      const params = new URLSearchParams({ _id }).toString()
      await fetch("/api/artwork?" + params, { method: "DELETE" })
      dispatch({ type: "DELETE_ARTWORK", payload: { ...activeArt } })
      setActiveArt(null)
      setSubCategory("")
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
          {Object.keys(artWorks).map(cat => {
            return (
              <div className="wrapper" key={cat}>
                <input
                  id={cat}
                  type="radio"
                  className="radio"
                  name="medium"
                  value={cat}
                  checked={category === cat}
                  onChange={updateCategory}
                />
                <label htmlFor={cat} className="radio btn">
                  {cat}
                </label>
              </div>
            )
          })}
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
            {category
              ? Object.keys(artWorks[category]).map(subCat => (
                  <React.Fragment key={subCat}>
                    <input
                      id={subCat}
                      type="radio"
                      className="radio"
                      name="subcategories"
                      value={subCat}
                      checked={subCategory === subCat}
                      onChange={updateSubCategory}
                    />
                    <label className="radio btn btn-sm sub" htmlFor={subCat}>
                      {subCat}
                    </label>
                  </React.Fragment>
                ))
              : null}
          </div>
        </li>
      </ul>
      <div className="thumbnail-container scrollbar scrollbar-deep-blue">
        <ul className="thumbnail-list">
          {!category || !subCategory
            ? null
            : artWorks[category][subCategory]?.map(({ _id, thumbnail, title }) => (
                <React.Fragment key={_id}>
                  <img
                    className={`thumbnail-image img ${activeArt?._id === _id ? "img-clicked" : ""}`}
                    src={thumbnail}
                    alt={title}
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
