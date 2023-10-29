import React from "react"
import Edit from "./components/Edit.js"
import Upload from "./components/Upload.js"
import Delete from "./components/Delete.jsx"
import Alerts from "./components/Alerts.js"
import { ArtworkProvider } from "./context/ArtworkContext.js"
import { AlertProvider } from "./context/AlertContext.js"

export default function App({ artWorks }) {
  return (
    <ArtworkProvider artWorks={artWorks}>
      <AlertProvider>
        <section className="upload-section" id="upload">
          <img className="up logoEdge" src="images/kaylalogogreen.png" aria-hidden />
          <img className="up logoEdgeRight" src="images/kaylalogogreen.png" aria-hidden />
          <div className="upload-form">
            <h2>New Artwork</h2>
            <Upload />
          </div>
        </section>

        <section className="thumbnail-section delete" id="delete">
          <div className="delete-form">
            <h2>Existing Artwork</h2>
            <Delete />
            <Edit />
          </div>
        </section>
        <Alerts />
      </AlertProvider>
    </ArtworkProvider>
  )
}
