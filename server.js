import "dotenv/config"
import express from "express"
import ejs from "ejs"
import session from "express-session"
// import fileUpload from "express-fileupload"
import secure from "ssl-express-www"
import connectDB from "./db/init.js"
import pageRouter from "./routes/pages.js"
import apiRouter from "./routes/api.js"

const app = express()

app.use(secure)

app.set("view engine", "ejs")
app.use(express.static("public"))
// app.use(fileUpload())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
      maxAge: 60 * 60 * 1000,
    },
  })
)
connectDB()

app.use("/", pageRouter)
app.use("/api", apiRouter)

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("server started on port", server.address().port)
})
