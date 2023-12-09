import { Router } from "express"
import Artwork from "../db/models/artwork.js"
import { uploader } from "../middleware/uploader.js"
import { isAuthenticated } from "../middleware/auth.js"
import { storageClient } from "../google-client.js"
import { fetchArt } from "../artState.js"
import { slugify } from "../utils/stringUtils.js"
import mongoose from "mongoose"

const apiRouter = Router()

apiRouter.use(isAuthenticated)

apiRouter.post("/artwork", uploader, async (req, res) => {
  const { category, subCategory, title, extension } = req.body
  const newArt = new Artwork({
    thumbnail: storageClient.buildThumbnailUrl({ category, subCategory, title }),
    title: slugify(title),
    subCategory: slugify(subCategory),
    extension,
    category,
    nextArtwork: null,
  })
  try {
    const prevArt = await Artwork.findOneAndUpdate(
      { category, subCategory, nextArtwork: null, _id: { $ne: newArt._id } },
      { $set: { nextArtwork: newArt._id } },
      { new: true }
    )
    await newArt.save()
    console.log("Finished uploading new image to collection:", title)
    fetchArt()
    res.status(201).json({ newArt, prevArt })
  } catch (err) {
    console.log("Error uploading new image to collection:", title)
    console.log(err)
    res.status(500).send(err.message)
  }
})

apiRouter.delete("/artwork", async (req, res) => {
  const { _id } = req.query
  let art
  try {
    art = await Artwork.findOne({ _id })
    if (!art) throw new Error("Artwork not found")
  } catch (err) {
    console.log("Unable to fetch art from params:", _id)
    console.log(err)
    res.status(400).send(err.message)
  }
  try {
    await Promise.all([...storageClient.deleteFile(art), Artwork.deleteOne({ _id })])
    const prevArt = await Artwork.findOneAndUpdate(
      { category: art.category, subCategory: art.subCategory, nextArtwork: art._id },
      { $set: { nextArtwork: art.nextArtwork } },
      { new: true }
    )

    fetchArt()
    res.status(200).json({ prevArt })
  } catch (err) {
    console.log("Error deleting artwork:", art?.title)
    console.log(err)
    res.status(500).send(err?.message)
  }
})

apiRouter.put("/artwork", async (req, res) => {
  const { oldImg, newImg } = req.body
  const thumbnail = storageClient.buildThumbnailUrl(newImg)
  let { category, subCategory, title } = newImg
  subCategory = slugify(subCategory)
  title = slugify(title)
  const nextArtwork =
    subCategory === oldImg.subCategory && category === oldImg.category ? newImg.nextArtwork : null

  try {
    if (
      title !== oldImg.title ||
      subCategory !== oldImg.subCategory ||
      category !== oldImg.category
    ) {
      await Promise.all(storageClient.moveFile(oldImg, { ...newImg, subCategory, title }))
    }
    const updatedArt = await Artwork.findOneAndUpdate(
      { _id: oldImg._id },
      { thumbnail, title, subCategory, category, nextArtwork },
      { new: true }
    )
    let prevArt, newLocationPrev
    prevArt = await Artwork.findOneAndUpdate(
      {
        category: oldImg.category,
        subCategory: oldImg.subCategory,
        nextArtwork: oldImg._id,
        _id: { $ne: newImg._id },
      },
      { nextArtwork: oldImg.nextArtwork },
      { new: true }
    )
    newLocationPrev = await Artwork.findOneAndUpdate(
      { category, subCategory, nextArtwork, _id: { $ne: newImg._id } },
      { nextArtwork: newImg._id },
      { new: true }
    )
    fetchArt()
    res.status(201).json({ updatedArt, prevArt, newLocationPrev })
  } catch (err) {
    console.log("Error moving artwork: ")
    console.log(err)
    res.status(500).send(err.message)
  }
})

apiRouter.patch("/artwork", async (req, res) => {
  const { movedArt, neighborArt } = req.body
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    // Update the old left neighbor to point to the movedArt's nextArtwork
    await Artwork.findOneAndUpdate(
      { nextArtwork: movedArt._id },
      { nextArtwork: movedArt.nextArtwork },
      { session },
    )
    // Update the new left neighbor to point to movedArt
    await Artwork.findOneAndUpdate(
      { nextArtwork: neighborArt?._id || null, subCategory: movedArt.subCategory },
      { nextArtwork: movedArt._id },
      { session },
    )
    // Update movedArt to point to the new right neighbor
    await Artwork.findOneAndUpdate(
      { _id: movedArt._id },
      { nextArtwork: neighborArt?._id || null },
      { session },
    )
    await session.commitTransaction()
    fetchArt()
    res.status(200).end()
  } catch (err) {
    await session.abortTransaction()
    console.log("Error updating artwork: ")
    console.log(err)
    res.status(500).send(err.message)
  } finally {
    session.endSession()
  }
})

export default apiRouter
