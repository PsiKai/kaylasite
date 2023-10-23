import { Router } from "express"
import Artwork from "../db/models/artwork.js"
import { uploader } from "../middleware/uploader.js"
import storage, { baseStorageUrl, bucketName, thumbs } from "../google-client.js"
import { fetchArt } from "../artState.js"

const apiRouter = Router()

apiRouter.post("/artwork", uploader, async (req, res) => {
  const { category, subCategory, title } = req.body
  const [{ googleFileName, thumbName }] = req.files
  const newArt = new Artwork({
    src: `${baseStorageUrl}/${bucketName}/${googleFileName}`,
    thumbnail: `${baseStorageUrl}/${thumbs}/${thumbName}`,
    alt: title,
    category,
    subCategory,
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
  const { _id, thumbnail, src } = req.query

  const bucketDeletion = new Promise(async (resolve, reject) => {
    try {
      const [_url, path] = src.split(baseStorageUrl + "/")
      const [_bucket, fileName] = path.split(bucketName + "/")
      await storage.bucket(bucketName).file(fileName).delete()
      console.log("Finished deleting from bucket:", src)
      resolve()
    } catch (err) {
      console.log("Error deleting from bucket:", src)
      console.log(err)
      reject(err)
    }
  })
  const thumbnailDeletion = new Promise(async (resolve, reject) => {
    try {
      const [_url, path] = thumbnail.split(baseStorageUrl)
      const [_bucket, fileName] = path.split(thumbs + "/")
      await storage.bucket(thumbs).file(fileName).delete()
      console.log("Finished deleting from thumbnail bucket:", thumbnail)
      resolve()
    } catch (err) {
      console.log("Error deleting from bucket:", src)
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
      console.log("Error deleting from bucket:", src)
      console.log(err)
      reject(err)
    }
  })

  try {
    await Promise.all([bucketDeletion, thumbnailDeletion, collectionDeletion])
    fetchArt()
    res.status(204).end()
  } catch (err) {
    console.log("Error deleting artwork:", src)
    console.log(err)
    res.status(500).send(err?.message)
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
