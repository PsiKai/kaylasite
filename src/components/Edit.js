import React from "react"

export default function Edit() {
	return (
		<form id="updateForm" action="/update" method="POST">
			<ul className="upload-data update-data hidden">
				<li>
					<label htmlFor="categories">
						<p>
							<strong>Art Medium</strong>
						</p>
					</label>
				</li>
				<li>
					<div className="wrapper">
						<input
							id="photoUp"
							type="radio"
							name="upCat"
							value="Photography"
							className="radio"
							required
						/>
						<label htmlFor="photoUp" className="update radio btn">
							Photography
						</label>
					</div>
					<div className="wrapper">
						<input
							id="paintUp"
							type="radio"
							name="upCat"
							value="Painting"
							className="radio"
						/>
						<label htmlFor="paintUp" className="update radio btn">
							Painting
						</label>
					</div>
					<div className="wrapper">
						<input
							id="drawUp"
							type="radio"
							name="upCat"
							value="Drawing"
							className="radio"
						/>
						<label htmlFor="drawUp" className="update radio btn">
							Drawing
						</label>
					</div>
					<div className="wrapper">
						<input
							id="digitalUp"
							type="radio"
							name="upCat"
							value="Digital"
							className="radio"
						/>
						<label htmlFor="digitalUp" className="update radio btn">
							Digital
						</label>
					</div>
				</li>
				<li>
					<label>
						<p>
							<strong>Subject Matter</strong>
						</p>
					</label>
				</li>
				<li>
					<input
						id="subcatUp"
						type="text"
						name="subcatUp"
						className="subcat update"
						autoComplete="off"
						placeholder="Enter Subject"
						required
						spellCheck="false"
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
						name="nameUp"
						className="subcat update"
						placeholder="Name Your Piece"
						required
						autoComplete="off"
						spellCheck="false"
					/>
				</li>
				<button type="submit" className="btn btn-lg btn-primary">
					<i className="fas fa-upload" />
					Submit Changes
				</button>
			</ul>
		</form>
	)
}
