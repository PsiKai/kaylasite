import { Router } from "express"
import Artwork from "../db/models/artwork.js"
import { uploader } from "../middleware/uploader.js"
import { storageClient } from "../google-client.js"
import { fetchArt } from "../artState.js"
import { slugify } from "../utils/stringUtils.js"

const apiRouter = Router()

apiRouter.post("/artwork", uploader, async (req, res) => {
  const { category, subCategory, title, extension } = req.body
  const newArt = new Artwork({
    thumbnail: storageClient.buildThumbnailUrl({ category, subCategory, title }),
    title: slugify(title),
    subCategory: slugify(subCategory),
    extension,
    category,
  })
  try {
    await newArt.save()
    console.log("Finished uploading new image to collection:", title)
    fetchArt()
    res.status(201).json({ newArt })
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
  } catch (err) {
    console.log("Unable to fetch art from params:", _id)
    console.log(err)
    res.status(400).send(err.message)
  }
  try {
    await Promise.all([...storageClient.deleteFile(art), Artwork.deleteOne({ _id })])
    fetchArt()
    res.status(204).end()
  } catch (err) {
    console.log("Error deleting artwork:", title)
    console.log(err)
    res.status(500).send(err?.message)
  }
})

apiRouter.put("/artwork", async (req, res) => {
  const { oldImg, newImg } = req.body
  const thumbNail = storageClient.buildThumbnailUrl(newImg)
  let { category, subCategory, title } = newImg
  subCategory = slugify(subCategory)
  title = slugify(title)

  try {
    await Promise.all([
      ...storageClient.moveFile(oldImg, newImg),
      ArtWork.findOneAndUpdate({ _id: oldImg._id }, { thumbnail, title, subCategory, category }),
    ])
    fetchArt()
    res.status(204).end()
  } catch (err) {
    console.log("Error moving artwork: ", title)
    console.log(err)
    res.status(500).send(err.message)
  }
})

//apiRouter.post("/update", (req, res) => {
//	//combines form data to create a file name that exists in google cloud
//	const { oldImage, subcatUp, upCat, nameUp } = req.body
//	let oldImg = oldImage.split("/")
//	let oldSrc =
//		oldImg[4] + "/" + oldImg[5] + "/" + oldImg[6].split("-thumb.jpg")[0]
//	const subCat = subcatUp
//		.split(" ")
//		.map(_.capitalize)
//		.join(" ")
//		.replace(/ /g, "-")
//	let newSrc = upCat + "/" + subCat + "/" + nameUp.replace(/ /g, "-")

//	//changes old file to new file by changing location in google cloud bucket
//	async function moveFile() {
//		await storage
//			.bucket(thumbs)
//			.file(oldSrc + "-thumb.jpg")
//			.move(newSrc + "-thumb.jpg")
//		console.log("thumb moved from " + oldSrc + " to " + newSrc)
//		await storage
//			.bucket(bucketName)
//			.file(oldSrc + ".jpg")
//			.move(newSrc + ".jpg")
//		console.log("image moved from " + oldSrc + " to " + newSrc)
//		await listFiles().catch(console.error)
//	}

//	moveFile().catch(console.error)
//	res.redirect("/upload#delete")
//})

export default apiRouter
