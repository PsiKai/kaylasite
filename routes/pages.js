import { Router } from "express"
import bcrypt from "bcrypt"
import { getArt } from "../artState.js"
import { titleDesc, singleArtCopy } from "../copy/title_description.js"
import User from "../db/models/user.js"
import { isAuthenticated } from "../middleware/auth.js"
import { storageClient } from "../google-client.js"
import { capitalize } from "../utils/stringUtils.js"
import { randomArtSample } from "../utils/artUtils.js"

const pageRouter = Router()

pageRouter.get("/", async (_req, res) => {
  const randomArt = await randomArtSample(6)

  res.render("index", { randomArt, pageCopy: titleDesc[0], path: "/" })
})

pageRouter.get("/login", (_req, res) => {
  res.render("login", { pageCopy: titleDesc[0], path: "/login" })
})

pageRouter.post("/login", async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username }).lean()
  if (!user) return res.status(401).redirect("/login")
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).redirect("/login")

  req.session.regenerate(sessionError => {
    if (sessionError) console.log("ERROR GENERATING SESSION: ", sessionError)
    req.session.user = user._id.toString()
    req.session.save(sessionSaveError => {
      if (sessionSaveError) {
        console.log("ERROR GENERATING SESSION: ", sessionSaveError)
        res.redirect("/login")
      } else {
        res.redirect("/upload")
      }
    })
  })
  // const salt = await bcrypt.genSalt(10)
  // const newPass = await bcrypt.hash(password, salt)
  // await User.findOneAndUpdate({ username }, { password: newPass })
})

pageRouter.get("/upload", isAuthenticated, async (_req, res) => {
  const artWorks = await getArt()
  res.render("upload", { artWorks, pageCopy: titleDesc[0], path: "/upload" })
})

pageRouter.get("/:category", async (req, res) => {
  let { category } = req.params
  category = capitalize(category)

  if (!titleDesc.map(item => item.page).includes(category)) return res.redirect("/")

  const pageCopy = titleDesc.find(item => item.page === category) || {}
  const artWorks = await getArt()
  const artCategory = artWorks[category] || {}

  res.render("template", {
    pageCopy,
    artCategory,
    category,
    path: `/${category}`,
  })
})

pageRouter.get("/:category/:subCategory/:_id", async (req, res) => {
  const { _id, category, subCategory } = req.params
  try {
    const artWorks = await getArt()
    const foundArt = artWorks[category][subCategory]?.find(art => art._id.toString() === _id)
    if (foundArt) {
      const [signedUrl] = await storageClient.signedUrl(foundArt)

      const pageCopy = singleArtCopy(foundArt)

      res.render("single", {
        signedUrl,
        artWork: foundArt,
        pageCopy,
        path: `/${category}/${subCategory}/${_id}`,
      })
    } else {
      res.redirect("/" + category)
    }
  } catch (error) {
    console.log("Error generating signed URL")
    console.log(error)
    res.redirect("/" + category)
  }
})

export default pageRouter
