import React, { useContext, useState, useMemo } from "react"
import { ArtworkContext } from "../context/ArtworkContext.js"
import useAlerts from "../hooks/useAlerts.js"
import Edit from "./Edit.js"
import CategoryRadios from "./CategoryRadios.js"
import SubCategoryRadios from "./SubCategoryRadios.js"

export default function Delete() {
  const { artWorks, dispatch } = useContext(ArtworkContext)
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [activeArt, setActiveArt] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { setAlert } = useAlerts()

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
      setAlert({ message: "Successfully deleted artwork!", type: "success" })
      setActiveArt(null)
      setSubCategory("")
    } catch (err) {
      console.log(err)
      setAlert({ message: "There was an error deleting this artwork", type: "error" })
    } finally {
      setDeleting(false)
    }
  }

  const onUpdateComplete = () => {
    setActiveArt(null)
    setSubCategory("")
    setAlert({ message: "Successfully edited artwork!", type: "success" })
  }

  return (
    <>
      <form onSubmit={handleDeletion}>
        <div>
          <label htmlFor="medium">
            <p>
              <strong>Select Medium</strong>
            </p>
          </label>
          <div className="radio-btn-container">
            <CategoryRadios value={category} onChange={updateCategory} idModifier={"delete"} />
          </div>
          <label htmlFor="subcat">
            <p>
              <strong>Subject Matter</strong>
            </p>
          </label>
          <div className="radio-btn-container">
            {category ? (
              <SubCategoryRadios
                subCategories={Object.keys(artWorks[category])}
                onChange={updateSubCategory}
                value={subCategory}
                idModifier={"delete"}
              />
            ) : null}
          </div>
        </div>
        <div className="thumbnail-container scrollbar scrollbar-deep-blue ">
          <div className="thumbnail-list">
            {!category || !subCategory
              ? null
              : artWorks[category][subCategory]?.map(({ _id, thumbnail, title }) => (
                  <React.Fragment key={_id}>
                    <img
                      className={`thumbnail-image img ${
                        activeArt?._id === _id ? "img-clicked" : ""
                      }`}
                      src={thumbnail}
                      alt={title}
                      onClick={() => updateActiveArt(_id)}
                    />
                  </React.Fragment>
                ))}
          </div>
        </div>
        <button
          disabled={deleting || !activeArt}
          name="button"
          type="submit"
          className="btn btn-lg btn-danger"
        >
          <i className="fa fa-trash" />
          {deleting ? "Removing Artwork..." : "Remove Artwork"}
        </button>
      </form>
      {activeArt ? <Edit artWork={activeArt} onUpdateComplete={onUpdateComplete} /> : null}
    </>
  )
}
