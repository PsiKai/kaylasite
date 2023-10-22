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
  const randomArt = Object.entries(artWorks).reduce((random, [category, subcategories]) => {
    const subCatValues = Object.values(subcategories)
    const randomSubcatIndex = Math.floor(Math.random() * subCatValues.length)
    const randomSubcat = subCatValues[randomSubcatIndex]
    const randomWorkIndex = Math.floor(Math.random() * randomSubcat.length)
    random.push(randomSubcat[randomWorkIndex])
    return random
  }, [])

  res.render("index", { randomArt, artWorks })
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
  res.render("upload", { artWorks })
})

pageRouter.get("/:category", async (req, res) => {
  const artWorks = await getArt()
  let { category } = req.params
  category = category.charAt(0).toUpperCase() + category.slice(1)
  const pageCopy = titleDesc.find(item => item.page === category)
  const artCategory = artWorks[category]

  res.render("template", {
    pageCopy,
    artCategory,
  })
})

export default pageRouter
