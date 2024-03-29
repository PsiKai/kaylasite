import React, { useRef, useContext, useState } from "react"
import { ArtworkContext } from "../context/ArtworkContext.js"
import useAlerts from "../hooks/useAlerts.js"
import Edit from "./Edit.js"
import CategoryRadios from "./CategoryRadios.js"
import SubCategoryRadios from "./SubCategoryRadios.js"
import ConfirmationModal from "./ConfirmationModal.js"
import EditCarousel from "./EditCarousel.js"

export default function Delete() {
  const { artWorks, dispatch } = useContext(ArtworkContext)
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [activeArt, setActiveArt] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { setAlert } = useAlerts()
  const dialogRef = useRef()

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
    setSubCategory("")
  }

  const handleDeletion = async e => {
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
    <div className="upload-data">
      <CategoryRadios value={category} onChange={updateCategory} idModifier={"delete"} />
      {category ? (
        <SubCategoryRadios
          subCategories={Object.keys(artWorks[category])}
          onChange={updateSubCategory}
          value={subCategory}
          idModifier={"delete"}
        />
      ) : null}
      {!category || !subCategory ? null : (
        <EditCarousel
          onChange={updateActiveArt}
          activeArt={activeArt}
          artworks={artWorks[category][subCategory]}
        />
      )}
      {activeArt ? (
        <>
          <div className="delete--thumbnail">
            <h4>
              <strong>{activeArt.title}</strong>
            </h4>
            <img id="preview" src={activeArt.thumbnail} alt={activeArt.title} />
          </div>
          <div className="edit-art-container upload-form upload-data">
            <Edit artWork={activeArt} onUpdateComplete={onUpdateComplete} />
            <span className="text-center">--OR--</span>
            <button
              disabled={deleting || !activeArt}
              name="button"
              type="submit"
              className="btn btn-lg btn-danger"
              onClick={() => dialogRef.current.showModal()}
            >
              <i className="fa fa-trash" />
              {deleting ? "Removing Artwork..." : "Remove Artwork"}
            </button>
            <ConfirmationModal ref={dialogRef} onConfirm={handleDeletion} confirmAction="Delete">
              <div className="delete-confirmation--content">
                <h3>Are you sure you want to delete this artwork?</h3>
                <div className="delete--thumbnail">
                  <img src={activeArt.thumbnail} alt={activeArt.title} />
                  <h4>{activeArt.title}</h4>
                </div>
                <p>
                  This action is <strong>PERMANENT.</strong> Please confirm you want to remove the
                  artwork.
                </p>
              </div>
            </ConfirmationModal>
          </div>
        </>
      ) : null}
    </div>
  )
}
