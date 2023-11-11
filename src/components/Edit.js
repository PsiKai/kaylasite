import React, { useState, useContext } from "react"
import { ArtworkContext } from "../context/ArtworkContext.js"
import CategoryRadios from "./CategoryRadios.js"
import SubCategoryRadios from "./SubCategoryRadios.js"

export default function Edit({ artWork, onUpdateComplete }) {
  const [form, setForm] = useState(artWork || {})
  const [updating, setUpdating] = useState(false)
  const { artWorks, dispatch } = useContext(ArtworkContext)

  const updateForm = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const submitUpdates = async e => {
    e.preventDefault()
    setUpdating(true)
    try {
      const body = { oldImg: artWork, newImg: form }
      await fetch("/api/artwork/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      onUpdateComplete()
      dispatch({ type: "MOVE_ARTWORK", payload: body })
    } catch (error) {
      console.log(error)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <form id="updateForm" onSubmit={submitUpdates}>
      <div className="upload-data update-data">
        <label htmlFor="categories">
          <p>
            <strong>Art Medium</strong>
          </p>
        </label>
        <div className="radio-btn-container">
          <CategoryRadios onChange={updateForm} value={form.category} idModifier="update" />
        </div>
        <label>
          <p>
            <strong>Subject Matter</strong>
          </p>
        </label>
        <div className="radio-btn-container">
          <SubCategoryRadios
            subCategories={Object.keys(artWorks[form.category] || {})}
            value={form.subCategory}
            onChange={updateForm}
            idModifier="update"
          />
        </div>
        <div>
          <input
            id="subcatUp"
            type="text"
            name="subCategory"
            className="subcat"
            placeholder="Enter Subject"
            required
            autoComplete="off"
            spellCheck="false"
            value={form.subCategory}
            onChange={updateForm}
          />
        </div>
        <label>
          <p>
            <strong>Artwork Title</strong>
          </p>
        </label>
        <div>
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
        <button type="submit" className="btn btn-lg btn-primary" disabled={updating}>
          <i className="fas fa-upload" />
          {updating ? "Submitting..." : "Submit Changes"}
        </button>
      </div>
    </form>
  )
}
