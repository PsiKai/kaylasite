import mongoose from "mongoose"

const artWorkSchema = new mongoose.Schema({
	category: String,
	subCategory: String,
	src: String,
	thumbnail: String,
	alt: String,
})

const Artwork = new mongoose.model("ArtWork", artWorkSchema)

export default Artwork
