import React from "react"
import Edit from "./components/Edit.js"
import Upload from "./components/Upload.js"
import Delete from "./components/Delete.js"
import { ArtworkProvider } from "./context/ArtworkContext.js"

export default function App({ artWorks }) {
	return (
		<ArtworkProvider artWorks={artWorks}>
			<section className="upload-section" id="upload">
				<img className="up logoEdge" src="images/kaylalogogreen.png" alt="" />
				<img
					className="up logoEdgeRight"
					src="images/kaylalogogreen.png"
					alt=""
				/>
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
		</ArtworkProvider>
	)
}
