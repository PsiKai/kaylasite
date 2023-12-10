import React, { useState, useContext, useEffect, useMemo } from "react"
import { ArtworkContext } from "../context/ArtworkContext.js"
import useAlerts from "../hooks/useAlerts.js"
import CategoryRadios from "./CategoryRadios.js"
import SubCategoryRadios from "./SubCategoryRadios.js"

export default function Edit({ artWork, onUpdateComplete }) {
  const [form, setForm] = useState(artWork || {})
  const [updating, setUpdating] = useState(false)
  const { artWorks, dispatch } = useContext(ArtworkContext)
  const { setAlert } = useAlerts()

  const updateForm = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  useEffect(() => {
    setForm(artWork || {})
  }, [artWork])

  const submitUpdates = async e => {
    e.preventDefault()
    setUpdating(true)
    try {
      const body = { oldImg: artWork, newImg: { ...form, nextArtwork: artWork.nextArtwork } }
      const res = await fetch("/api/artwork/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const { updatedArt, prevArt, newLocationPrev } = await res.json()
      onUpdateComplete()

      console.log({ updatedArt, newLocationPrev, prevArt })
      dispatch({ type: "UPDATE_ARTWORK", payload: newLocationPrev })
      dispatch({ type: "UPDATE_ARTWORK", payload: prevArt })
      dispatch({ type: "MOVE_ARTWORK", payload: { ...body, newImg: updatedArt } })
    } catch (error) {
      setAlert({ type: "warning", message: "There was an error updating this artwork" })
      console.log(error)
    } finally {
      setUpdating(false)
    }
  }

  const noChanges = useMemo(() => {
    return Object.entries(form).every(([field, value]) => artWork[field] === value)
  }, [form])

  return (
    <form id="updateForm" onSubmit={submitUpdates}>
      <div className="upload-data">
        <CategoryRadios onChange={updateForm} value={form.category} idModifier="update" />
        <SubCategoryRadios
          subCategories={Object.keys(artWorks[form.category] || {})}
          value={form.subCategory}
          onChange={updateForm}
          idModifier="update"
          customSubCat
        />
        <div>
          <legend>
            <label htmlFor="artnameUp">
              <p>
                <strong>Artwork Title</strong>
              </p>
            </label>
          </legend>
          <input
            id="artnameUp"
            type="text"
            name="title"
            className="subcat"
            placeholder="Name Your Piece"
            value={form.title}
            onChange={updateForm}
            required
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <button type="submit" className="btn btn-lg btn-primary" disabled={updating || noChanges}>
          <i className="fas fa-upload" />
          {updating ? "Submitting..." : "Submit Changes"}
        </button>
      </div>
    </form>
  )
}
