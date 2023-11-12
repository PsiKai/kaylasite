import React, { useState, useContext } from "react"
import { ArtworkContext } from "../context/ArtworkContext"
import useAlerts from "../hooks/useAlerts.js"
import CategoryRadios from "./CategoryRadios.js"
import SubCategoryRadios from "./SubCategoryRadios.js"
import FileUpload from "./FileUpload.js"

export default function Upload() {
  const { artWorks, dispatch } = useContext(ArtworkContext)
  const [image, setImage] = useState()
  const [form, setForm] = useState({})
  const [uploading, setUploading] = useState(false)
  const { setAlert } = useAlerts()

  const updateImage = e => {
    const [imgFile] = e.target.files
    if (imgFile) {
      setImage(imgFile)
    } else {
      setImage("")
      setForm({})
    }
  }

  const updateForm = e => {
    setForm(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    })
  }

  const uploadNewArt = async e => {
    e.preventDefault()

    const uploadForm = new FormData(e.target)
    const imageField = uploadForm.get("image")
    uploadForm.delete("image")
    uploadForm.append("image", imageField)

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
      setForm({})
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
        <div className="upload-data">
          <FileUpload file={image} onFile={updateImage} />
          {!image ? null : (
            <>
              <div>
                <label htmlFor="category">
                  <p>
                    <strong>Art Medium</strong>
                  </p>
                </label>
                <div className="radio-btn-container">
                  <CategoryRadios
                    idModifier="upload"
                    onChange={updateForm}
                    value={form.category || ""}
                  />
                </div>
              </div>
              {!form.category ? null : (
                <>
                  <div className="form-field--group">
                    <label htmlFor="subcategory">
                      <p>
                        <strong>Subject Matter</strong>
                      </p>
                    </label>
                    <div className="radio-btn-container">
                      <SubCategoryRadios
                        idModifier="upload"
                        subCategories={Object.keys(artWorks[form.category] || {})}
                        value={form.subCategory || ""}
                        onChange={updateForm}
                      />
                    </div>
                    <div>
                      <input
                        id="subcategory"
                        type="text"
                        name="subCategory"
                        className="subcat"
                        autoComplete="off"
                        placeholder="Enter Subject"
                        required
                        spellCheck="false"
                        value={form.subCategory || ""}
                        onChange={updateForm}
                      />
                    </div>
                  </div>
                  {!form.subCategory ? null : (
                    <>
                      <div>
                        <label htmlFor="title">
                          <p>
                            <strong>Artwork Title</strong>
                          </p>
                        </label>
                        <input
                          id="title"
                          type="text"
                          name="title"
                          className="subcat"
                          placeholder="Name Your Piece"
                          required
                          autoComplete="off"
                          spellCheck="false"
                          value={form.title || ""}
                          onChange={updateForm}
                        />
                      </div>
                      <button
                        type="submit"
                        className="submit-button btn btn-lg btn-info"
                        disabled={uploading || !form.title}
                      >
                        <i className="fas fa-upload" />
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  )
}
