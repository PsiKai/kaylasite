import mongoose from "mongoose"

const artWorkSchema = new mongoose.Schema({
  category: {
    type: String,
    index: true,
  },
  subCategory: {
    type: String,
  },
  thumbnail: String,
  title: String,
  extension: String,
  nextArtwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artworks",
    index: true,
  },
})

artWorkSchema.index({ nextArtwork: 1, subCategory: 1, category: 1 })

const Artwork = new mongoose.model("ArtWork", artWorkSchema)

export default Artwork
