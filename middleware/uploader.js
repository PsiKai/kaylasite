import busboy from "busboy"
import sharp from "sharp"
import stream from "stream"
import storage, { bucketName, thumbs } from "../google-client.js"
import { slugify } from "../utils/stringUtils.js"

export const uploadPath = (category, subCategory, title, mimeType, thumb = false) => {
  const [_file, encoding] = mimeType.split("/")
  const extension = thumb ? "webp" : encoding
  return `${category}/${slugify(subCategory)}/${slugify(title)}.${extension}`
}

export const uploader = async (req, res, next) => {
  const bb = busboy({ headers: req.headers })
  const uploadPromises = []

  bb.on("file", (name, file, info) => {
    req.files = req.files || []
    const { filename, encoding, mimeType } = info
    const { title, category, subCategory } = req.body

    const googleBucket = storage.bucket(bucketName)
    const googleFileName = uploadPath(category, subCategory, title, mimeType)
    const googleFile = googleBucket.file(googleFileName)
    const googleUploadStream = googleFile.createWriteStream()

    const thumbBucket = storage.bucket(thumbs)
    const thumbName = uploadPath(category, subCategory, title, mimeType, true)
    const thumbFile = thumbBucket.file(thumbName)
    const thumbUploadStream = thumbFile.createWriteStream()

    const passThrough = new stream.PassThrough()
    const resizeStream = sharp().resize(null, 300).webp()

    req.files.push({ googleFileName, thumbName, mimeType })

    file.pipe(passThrough)

    const uploadPromise = new Promise((resolve, reject) => {
      passThrough
        .pipe(googleUploadStream)
        .on("finish", () => {
          console.log("Finished uploading fullsize image:", title)
          resolve()
        })
        .on("error", err => {
          console.log("Error uploading fullsize image:", title)
          console.log(err)
          reject(err)
        })
    })

    const thumbPromise = new Promise((resolve, reject) => {
      passThrough
        .pipe(resizeStream)
        .pipe(thumbUploadStream)
        .on("finish", () => {
          console.log("Finished uploading thumbnail:", title)
          resolve()
        })
        .on("error", err => {
          console.log("Error uploading thumbnail:", title)
          console.log(err)
          reject(err)
        })
    })

    uploadPromises.push(uploadPromise, thumbPromise)
  })

  bb.on("field", (name, val, info) => (req.body[name] = val))

  bb.on("close", () => {
    console.log("Done parsing form!")
    Promise.all(uploadPromises)
      .then(() => next())
      .catch(err => res.status(500).send(err.message))
  })

  req.pipe(bb)
}
