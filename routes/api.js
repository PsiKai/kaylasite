import { Router } from "express"
import sharp from "sharp"
import multer from "multer"
import fs from "fs"
import { Storage } from "@google-cloud/storage"
import Artwork from "../db/models/artwork.js"

const storage = new Storage()
const apiRouter = Router()

const bucketName = process.env.BUCKETNAME
const thumbs = process.env.THUMBS
const bucket = process.env.BUCKET
const thumbBucket = process.env.THUMBBUCKET

// async function listFiles() {
// 	const [files] = await storage.bucket(bucketName).getFiles()
// 	files.forEach(async (file) => {
// 		const [category, subCategory, fileName] = file.name.split("/")
// 		const existingArt = await Artwork.findOneAndUpdate(
// 			{ src: bucket + file.name },
// 			{ alt: fileName }
// 		)
// 		console.log({ existingArt })
// 		if (existingArt) return
// 		const newArt = new Artwork({
// 			category,
// 			subCategory,
// 			src: bucket + file.name,
// 			thumbnail: thumbBucket + file.name.split(".")[0] + "-thumb.jpg",
// 		})
// 		const saved = await newArt.save()
// 		console.log({ saved })
// })
// console.log("UPDATED MONGODB ART")
// }
// listFiles()

const localStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		const { categories, subcat } = req.body
		const subCategory = subcat
			.split(" ")
			.map(_.capitalize)
			.join(" ")
			.replace(/ /g, "-")
		const imageDirect = categories + "/" + subCategory + "/"
		var dir = "./" + imageDirect
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir)
		}
		cb(null, imageDirect)
	},
	filename: function (req, file, cb) {
		let tempImageName = file.originalname
		req.imageName = tempImageName
		cb(null, tempImageName.replace(/ /g, "-"))
	},
})

const upload = multer({
	storage: localStorage,
})

apiRouter.post("/upload", upload.single("image"), (req, res) => {
	//combines form inputs to create a filename for google cloud
	const { categories, subcat, name } = req.body
	const subCat = subcat
		.split(" ")
		.map(_.capitalize)
		.join(" ")
		.replace(/ /g, "-")
	const imgName = name.split(" ").map(_.capitalize).join(" ").replace(/ /g, "-")
	let img = req.imageName.replace(/ /g, "-")
	let imgTitle = img.split(".")[0]
	let imagePath = categories + "/" + subCat + "/" + img
	const thumbTitle = imgTitle + "-thumb.jpg"

	//uploads thumbnail
	async function uploadThumb() {
		await storage.bucket(thumbs).upload(thumbTitle, {
			metadata: { cacheControl: "no-cache" },
			gzip: true,
			destination: categories + "/" + subCat + "/" + imgName + "-thumb.jpg",
		})
		uploadFile().catch(console.error)
		fs.unlinkSync(imgTitle + "-thumb.jpg")
	}

	//uploads full-size image
	async function uploadFile() {
		await storage.bucket(bucketName).upload(imagePath, {
			metadata: { cacheControl: "no-cache" },
			gzip: true,
			destination: categories + "/" + subCat + "/" + imgName + ".jpg",
		})
		fs.unlinkSync(`${categories}/${subCat}/${img}`)
		fs.rmdirSync(`./${categories}/${subCat}/`)
		setTimeout(() => {
			fs.rmdirSync(`./${categories}`)
		}, 500)
		await listFiles().catch(console.error)
	}

	sharp(imagePath)
		.resize(null, 300)
		.toFile(thumbTitle, (err) => {
			if (!err) console.log("image resized")
			uploadThumb().catch(console.error)
		})

	res.redirect("/upload#upload")
})

apiRouter.post("/delete", (req, res) => {
	let imgUrl = req.body.image.split("/")
	let thumb = imgUrl[4] + "/" + imgUrl[5] + "/" + imgUrl[6]
	let image = thumb.split("-thumb")[0] + thumb.split("-thumb")[1]
	async function deleteFile() {
		await storage.bucket(thumbs).file(thumb).delete()
		console.log(thumb + " was deleted")
		await storage.bucket(bucketName).file(image).delete()
		console.log(image + " was deleted")
		await listFiles().catch(console.error)
	}
	deleteFile().catch(console.error)
	res.redirect("/upload#delete")
})

apiRouter.post("/update", (req, res) => {
	//combines form data to create a file name that exists in google cloud
	const { oldImage, subcatUp, upCat, nameUp } = req.body
	let oldImg = oldImage.split("/")
	let oldSrc =
		oldImg[4] + "/" + oldImg[5] + "/" + oldImg[6].split("-thumb.jpg")[0]
	const subCat = subcatUp
		.split(" ")
		.map(_.capitalize)
		.join(" ")
		.replace(/ /g, "-")
	let newSrc = upCat + "/" + subCat + "/" + nameUp.replace(/ /g, "-")

	//changes old file to new file by changing location in google cloud bucket
	async function moveFile() {
		await storage
			.bucket(thumbs)
			.file(oldSrc + "-thumb.jpg")
			.move(newSrc + "-thumb.jpg")
		console.log("thumb moved from " + oldSrc + " to " + newSrc)
		await storage
			.bucket(bucketName)
			.file(oldSrc + ".jpg")
			.move(newSrc + ".jpg")
		console.log("image moved from " + oldSrc + " to " + newSrc)
		await listFiles().catch(console.error)
	}

	moveFile().catch(console.error)
	res.redirect("/upload#delete")
})

export default apiRouter
