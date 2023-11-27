import mongoose from "mongoose"

const artWorkSchema = new mongoose.Schema({
  category: String,
  subCategory: String,
  thumbnail: String,
  title: String,
  extension: String,
})

const Artwork = new mongoose.model("ArtWork", artWorkSchema)

export default Artwork
