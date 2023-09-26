import React from "react"

export default function Delete() {
	return (
		<form action="/delete" method="POST">
			<ul>
				<li>
					<label htmlFor="medium">
						<p>
							<strong>Select Medium</strong>
						</p>
					</label>
				</li>
				<li>
					<div className="wrapper">
						<input
							id="photos"
							type="radio"
							name="medium"
							value="photography"
							className="radio"
							required
						/>
						<label htmlFor="photos" className="radio btn">
							Photography
						</label>
					</div>
					<div className="wrapper">
						<input
							id="paintings"
							type="radio"
							name="medium"
							value="painting"
							className="radio"
						/>
						<label htmlFor="paintings" className="radio btn">
							Painting
						</label>
					</div>
					<div className="wrapper">
						<input
							id="drawings"
							type="radio"
							name="medium"
							value="drawing"
							className="radio"
						/>
						<label htmlFor="drawings" className="radio btn">
							Drawing
						</label>
					</div>
					<div className="wrapper">
						<input
							id="digitals"
							type="radio"
							name="medium"
							value="digital"
							className="radio"
						/>
						<label htmlFor="digitals" className="radio btn">
							Digital
						</label>
					</div>
				</li>
				<li>
					<label htmlFor="subcat">
						<p>
							<strong>Subject Matter</strong>
						</p>
					</label>
				</li>
				<li>
					<div className="flex-container"></div>
				</li>
			</ul>
			<div className="thumbnail-container scrollbar scrollbar-deep-blue">
				<ul className="thumbnail-list"></ul>
			</div>
			<label className="alert alert-danger hidden">
				<i className="fa fa-exclamation-circle" />
				<strong> Please select an artwork to update or delete!</strong>
			</label>
			<input
				type="text"
				id="imgDel"
				name="image"
				className="delete-img"
				value=""
			/>
			<label
				htmlFor="imgDel"
				className="btn btn-lg hidden del-label"
				value=""
			></label>
			<button name="button" type="submit" className="btn btn-lg btn-danger">
				<i className="fa fa-trash" />
				Remove Artwork
			</button>
			<label name="updateButton" className="btn btn-lg btn-success">
				<i className="far fa-edit" />
				Edit Artwork
				<i className="fas fa-angle-double-down hidden" />
			</label>
		</form>
	)
}
