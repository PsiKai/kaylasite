import { Storage } from "@google-cloud/storage"

const storage = new Storage()

export const baseStorageUrl = "https://storage.googleapis.com"

export const bucketName = process.env.BUCKETNAME
export const thumbs = process.env.THUMBS
export const bucket = process.env.BUCKET
export const thumbBucket = process.env.THUMBBUCKET

export default storage
