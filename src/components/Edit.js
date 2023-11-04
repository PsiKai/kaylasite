import React, { useState, useContext } from "react"
import { ArtworkContext } from "../context/ArtworkContext.js"

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
      <ul className="upload-data update-data">
        <li>
          <label htmlFor="categories">
            <p>
              <strong>Art Medium</strong>
            </p>
          </label>
        </li>
        <li>
          {["Photography", "Painting", "Drawing", "Digital"].map(category => (
            <div className="wrapper" key={category}>
              <input
                id="photoUp"
                type="radio"
                name="category"
                value={category}
                className="radio"
                required
                onChange={updateForm}
                checked={form.category === category}
              />
              <label htmlFor="photoUp" className="update radio btn">
                {category}
              </label>
            </div>
          ))}
        </li>
        <li>
          <label>
            <p>
              <strong>Subject Matter</strong>
            </p>
          </label>
        </li>
        <li>
          {Object.keys(artWorks[form.category] || {}).map(subCat => (
            <React.Fragment key={`${subCat}-update`}>
              <input
                id={`${subCat}-update`}
                type="radio"
                className="radio"
                name="subCategory"
                value={subCat}
                checked={form.subCategory === subCat}
                onChange={updateForm}
              />
              <label className="radio btn btn-sm sub" htmlFor={`${subCat}-update`}>
                {subCat}
              </label>
            </React.Fragment>
          ))}
        </li>
        <li>
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
        </li>
        <li>
          <label>
            <p>
              <strong>Artwork Title</strong>
            </p>
          </label>
        </li>
        <li>
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
        </li>
        <button type="submit" className="btn btn-lg btn-primary" disabled={updating}>
          <i className="fas fa-upload" />
          {updating ? "Submitting..." : "Submit Changes"}
        </button>
      </ul>
    </form>
  )
}
