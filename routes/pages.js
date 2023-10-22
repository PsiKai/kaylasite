import { Router } from "express"
import { default as _ } from "lodash"
// import bcrypt from "bcrypt"
import { getArt } from "../artState.js"
import { titleDesc } from "../copy/title_description.js"
import Artwork from "../db/models/artwork.js"
import User from "../db/models/user.js"
import { isAuthenticated } from "../middleware/auth.js"

const pageRouter = Router()

pageRouter.get("/", async (req, res) => {
  const artWorks = await getArt()
  let randomArt = Math.floor(Math.random() * artWorks.length)
  res.render("index", {
    randomArt,
    artWorks,
  })
})

pageRouter.get("/login", (req, res) => {
  res.render("login")
})

pageRouter.post("/login", async (req, res) => {
  res.redirect("/upload")
  // const { username, password } = req.body
  // const user = await User.findOne({ username }).lean()
  // if (!user) return res.status(400).render("login")
  // const isMatch = await Bun.password.verify(password, user.password)
  // if (!isMatch) return res.status(400).render("login")

  // req.session.regenerate((sessionError) => {
  // 	if (sessionError) console.log("ERROR GENERATING SESSION: ", sessionError)
  // 	req.session.user = user._id.toString()
  // 	req.session.save((sessionSaveError) => {
  // 		if (sessionSaveError)
  // 			console.log("ERROR GENERATING SESSION: ", sessionSaveError)
  // 		res.redirect("/upload")
  // 	})
  // })
  // const newPass = await Bun.password.hash("K4yLa4rti5t")
  // let newUser = await User.findOneAndUpdate(
  // 	{ username: "kaylakoss" },
  // 	{ password: newPass }
  // )
  // if (!newUser) {
  // 	newUser = new User({
  // 		username: "kaylakoss",
  // 	})
  // 	const salt = await bcrypt.genSalt(10)
  // 	newUser.password = await bcrypt.hash("K4yLa4rti5t", salt)
  // 	await newUser.save()
  // }
  // console.log(newUser)
  // res.redirect("/login")
})

// pageRouter.get("/upload", isAuthenticated, async (req, res) => {
pageRouter.get("/upload", async (req, res) => {
  const artWorks = await getArt()
  var paintings = artWorks.filter(artWork => artWork.category === "Painting")
  var digitalMedia = artWorks.filter(artWork => artWork.category === "Digital")
  var drawings = artWorks.filter(artWork => artWork.category === "Drawing")
  var photos = artWorks.filter(artWork => artWork.category === "Photography")

  var paintSub = _.groupBy(paintings, e => e.subCategory.replace(/&/g, "&"))
  var digitalSub = _.groupBy(digitalMedia, e => e.subCategory.replace(/&/g, "&"))
  var drawSub = _.groupBy(drawings, e => e.subCategory.replace(/&/g, "&"))
  var photoSub = _.groupBy(photos, e => e.subCategory.replace(/&/g, "&"))

  res.render("upload", {
    artWorks,
    paintSub,
    digitalSub,
    drawSub,
    photoSub,
  })
})

pageRouter.get("/:category", async (req, res) => {
  const artWorks = await getArt()
  const page = _.capitalize(req.params.category)
  const category = artWorks.filter(artWork => artWork.category === page)
  const subCated = _.groupBy(category, e => e.subCategory)
  const description = titleDesc.filter(item => item.page === page)
  res.render("template", {
    subCated,
    subCategoryList: Object.keys(subCated),
    pageType: description[0],
  })
})

export default pageRouter
