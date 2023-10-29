import React, { useState, useContext } from "react"
import { ArtworkContext } from "../context/ArtworkContext"
import useAlerts from "../hooks/useAlerts.js"

export default function Upload() {
  const { artWorks, dispatch } = useContext(ArtworkContext)
  const [image, setImage] = useState()
  const [uploading, setUploading] = useState(false)
  const { setAlert } = useAlerts()

  const updateImage = e => {
    const [imgFile] = e.target.files
    if (imgFile) {
      setImage(imgFile)
    } else {
      setImage("")
    }
  }

  const uploadNewArt = async e => {
    e.preventDefault()
    const uploadForm = new FormData(e.target)
    setUploading(true)
    try {
      const res = await fetch("/api/artwork", {
        method: "POST",
        body: uploadForm,
      })
      const { newArt } = await res.json()
      dispatch({ type: "ADD_ARTWORK", payload: newArt })
      setAlert({ message: "Successfully uploaded artwork!", type: "success" })
      e.target.reset()
      setImage(null)
    } catch (err) {
      console.log(err)
      setAlert({ message: "There was an error uploading this artwork", type: "error" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="form-data">
      <form className="form" onSubmit={uploadNewArt}>
        <ul className="upload-data">
          <li>
            <label htmlFor="category">
              <p>
                <strong>Art Medium</strong>
              </p>
            </label>
          </li>
          <li>
            <div className="wrapper">
              <input
                id="photo"
                type="radio"
                name="category"
                value="Photography"
                className="radio"
                required
              />
              <label htmlFor="photo" className="radio btn">
                Photography
              </label>
            </div>
            <div className="wrapper">
              <input id="paint" type="radio" name="category" value="Painting" className="radio" />
              <label htmlFor="paint" className="radio btn">
                Painting
              </label>
            </div>
            <div className="wrapper">
              <input id="draw" type="radio" name="category" value="Drawing" className="radio" />
              <label htmlFor="draw" className="radio btn">
                Drawing
              </label>
            </div>
            <div className="wrapper">
              <input id="digital" type="radio" name="category" value="Digital" className="radio" />
              <label htmlFor="digital" className="radio btn">
                Digital
              </label>
            </div>
          </li>
          <li>
            <label htmlFor="subcategory">
              <p>
                <strong>Subject Matter</strong>
              </p>
            </label>
          </li>
          <li>
            <input
              id="subcategory"
              type="text"
              name="subCategory"
              className="subcat"
              autoComplete="off"
              placeholder="Enter Subject"
              required
              spellCheck="false"
            />
          </li>
          <li>
            <label htmlFor="title">
              <p>
                <strong>Artwork Title</strong>
              </p>
            </label>
          </li>
          <li>
            <input
              id="title"
              type="text"
              name="title"
              className="subcat"
              placeholder="Name Your Piece"
              required
              autoComplete="off"
              spellCheck="false"
            />
          </li>
          <li className="img-preview">
            <img
              name="preview"
              id="preview"
              src={image ? URL.createObjectURL(image) : ""}
              alt={image?.name || ""}
            />
          </li>
          <li>
            <input
              type="file"
              id="img"
              name="image"
              accept="image/*"
              className="inputfile"
              required
              onChange={updateImage}
            />
            <label id="fileName" htmlFor="img" className="btn">
              <i className="fas fa-search" />
              {image?.name || "Choose a file"}
            </label>
          </li>
          <li>
            <button type="submit" className="btn btn-lg btn-info" disabled={uploading}>
              <i className="fas fa-upload" />
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </li>
        </ul>
      </form>
    </div>
  )
}
