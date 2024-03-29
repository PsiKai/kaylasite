import mongoose from "mongoose"
const connectURL = process.env.MONGO_URL

const connectDB = async () => {
  try {
    await mongoose.connect(connectURL)
    console.log("MongoDB connected")
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

export default connectDB
