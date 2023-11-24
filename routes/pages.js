import { Router } from "express"
import { default as _ } from "lodash"
import bcrypt from "bcrypt"
import { getArt } from "../artState.js"
import { titleDesc, singleArtCopy } from "../copy/title_description.js"
import Artwork from "../db/models/artwork.js"
import User from "../db/models/user.js"
import { isAuthenticated } from "../middleware/auth.js"
import { storageClient } from "../google-client.js"

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

  res.render("index", { randomArt, artWorks, pageCopy: titleDesc[0], path: "/" })
})

pageRouter.get("/login", (req, res) => {
  res.render("login", { pageCopy: titleDesc[0], path: "/login" })
})

pageRouter.post("/login", async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username }).lean()
  if (!user) return res.status(400).render("login")
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(400).render("login")

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
  // await User.findOneAndUpdate({ username: "kaylakoss" }, { password: newPass })
})

pageRouter.get("/upload", isAuthenticated, async (req, res) => {
  const artWorks = await getArt()
  res.render("upload", { artWorks, pageCopy: titleDesc[0], path: "/upload" })
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
    category,
    path: `/${category}`,
  })
})

pageRouter.get("/:category/:subCategory/:_id", async (req, res) => {
  try {
    const { _id, category, subCategory } = req.params
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
