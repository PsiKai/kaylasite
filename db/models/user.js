import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
})

const User = new mongoose.model("User", userSchema)

export default User
