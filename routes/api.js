import { Router } from "express"
import Artwork from "../db/models/artwork.js"
import { uploader, uploadPath } from "../middleware/uploader.js"
import storage, { baseStorageUrl, bucketName, thumbs } from "../google-client.js"
import { fetchArt } from "../artState.js"
import { slugify } from "../utils/stringUtils.js"

const apiRouter = Router()

apiRouter.post("/artwork", uploader, async (req, res) => {
  const { category, subCategory, title } = req.body
  const [{ thumbName, mimeType }] = req.files
  const [_mime, extension] = mimeType.split("/")
  const newArt = new Artwork({
    thumbnail: `${baseStorageUrl}/${thumbs}/${thumbName}`,
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
  const art = await Artwork.findOne({ _id })
  const { category, subCategory, title, extension, thumbnail } = art

  const bucketDeletion = new Promise(async (resolve, reject) => {
    try {
      await storage
        .bucket(bucketName)
        .file(`${category}/${subCategory}/${title}.${extension}`)
        .delete()
      console.log("Finished deleting from bucket:", title)
      resolve()
    } catch (err) {
      console.log("Error deleting from bucket:", title)
      console.log(err)
      reject(err)
    }
  })
  const thumbnailDeletion = new Promise(async (resolve, reject) => {
    try {
      const [_url, fileName] = thumbnail.split(thumbs + "/")
      await storage.bucket(thumbs).file(fileName).delete()
      console.log("Finished deleting from thumbnail bucket:", thumbnail)
      resolve()
    } catch (err) {
      console.log("Error deleting from bucket:", title)
      console.log(err)
      reject(err)
    }
  })
  const collectionDeletion = new Promise(async (resolve, reject) => {
    try {
      await Artwork.deleteOne({ _id })
      console.log("Finished deleting from collection:", _id)
      resolve()
    } catch (err) {
      console.log("Error deleting from bucket:", title)
      console.log(err)
      reject(err)
    }
  })

  try {
    await Promise.all([bucketDeletion, thumbnailDeletion, collectionDeletion])
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
  const { extension } = oldImg
  let { category, subCategory, title } = newImg

  subCategory = slugify(subCategory)
  title = slugify(title)
  const movedLocation = `${category}/${subCategory}/${title}`
  const [_thumbUrl, thumbFileName] = oldImg.thumbnail.split(thumbs + "/")

  try {
    await storage.bucket(bucketName).file(fileName).move(`${movedLocation}.${extension}`)
    await storage
      .bucket(thumbs)
      .file(thumbFileName)
      .move(movedLocation + ".webp")
    await Artwork.findOneAndUpdate(
      { _id: oldImg._id },
      {
        thumbnail: `${baseStorageUrl}/${thumbs}/${thumbFileName}`,
        title: slugify(title),
        subCategory: slugify(subCategory),
        category,
      },
      { update: true }
    )
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
