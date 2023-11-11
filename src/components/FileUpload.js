import { useState, useRef, useEffect } from "react"
import useAlerts from "../hooks/useAlerts.js"
import useDropzone from "../hooks/useDropzone.js"

export default function FileUpload({ onFile, file }) {
  const fileInput = useRef()

  function handleValidDrop(e) {
    fileInput.current.files = e.dataTransfer.files
    const changeEvent = new Event("change", { bubbles: true })
    fileInput.current.dispatchEvent(changeEvent)
  }

  const dropzoneProps = useDropzone(handleValidDrop)

  const clearSelectedFile = e => {
    const nullFile = { target: { files: [] } }
    onFile(nullFile)
  }

  return (
    <div id="fileName" {...dropzoneProps}>
      <input
        ref={fileInput}
        type="file"
        id="img"
        name="image"
        accept="image/*"
        className="inputfile"
        required
        onChange={onFile}
      />
      {file ? (
        <div className="image-preview-container">
          <img
            name="preview"
            id="preview"
            src={file ? URL.createObjectURL(file) : ""}
            alt={file?.name || ""}
          />
          <button type="button" onClick={clearSelectedFile} aria-label="remove selected file">
            <i className="fa fa-times-circle" aria-hidden="true"></i>
          </button>
        </div>
      ) : (
        <div className="upload-image-placeholder">
          <div className="drag-image-icon">
            <i className="fa fa-cloud-upload" aria-hidden="true"></i>
            <span>Drag and Drop your file</span>
          </div>
          <small>--OR--</small>
        </div>
      )}
      <label htmlFor="img" className="btn">
        <i className="fas fa-search" />
        {file?.name || "Choose a file"}
      </label>
    </div>
  )
}
