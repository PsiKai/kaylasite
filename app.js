//require node modules and initialize

//require('dotenv').config();
//const express = require("express");
//const bodyParser = require("body-parser");
//const _ = require("lodash");
//const ejs = require("ejs");
//const sharp = require('sharp');
//const multer = require("multer");
//const fs = require("file-system");
//const {Storage} = require('@google-cloud/storage');
//const storage = new Storage();
//const mongoose = require("mongoose");
//const passport = require("passport");
//const passportLocalMongoose = require("passport-local-mongoose");
//const session = require("express-session");
//const secure = require("ssl-express-www");

//const app = express();

//app.use(secure);

//app.set('view engine', "ejs");

//app.use(bodyParser.urlencoded({
//  extended: true
//}));
//app.use(bodyParser.json());
//app.use(express.static("public"));
//app.use(session({
//  secret: process.env.ACCESS_TOKEN_SECRET,
//  resave: false,
//  saveUninitialized: false
//}));
//app.use(passport.initialize());
//app.use(passport.session());

////connect to mongoDB for login verification
//mongoose.connect(process.env.MONGO_URL, {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
//  useFindAndModify: false
//});
//mongoose.set("useCreateIndex", true);

//const userSchema = new mongoose.Schema({
//  username: String,
//  password: String
//});

//userSchema.plugin(passportLocalMongoose);
//const User = new mongoose.model("User", userSchema);

//passport.use(User.createStrategy());
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

////initialize google cloud storage
//const bucketName = process.env.BUCKETNAME;
//const thumbs = process.env.THUMBS;
//const bucket = process.env.BUCKET;
//const thumbBucket = process.env.THUMBBUCKET;
//let artWorks = [];

////copy to display in the ejs templates
//const {titleDesc} = require("./copy/title_description")

////gets a list of all the files in the google cloud storage bucket

//async function listFiles() {
//  artWorks = [];
//  const [files] = await storage.bucket(bucketName).getFiles();
//  files.forEach(file => {
//    var string = file.name.split("/");
//    artWorks.push({
//      imgCategory: string[0],
//      subCat: string[1].replace(/-/g, ' '),
//      imgSrc: bucket + file.name,
//      thumbnail: thumbBucket + file.name.split('.')[0] + "-thumb.jpg",
//      alt: string[2]
//    });
//  });
//  console.log("files listed");

//}

////homescreen GET request
////calls google storage and waits to load homepage until the request is complete

//listFiles()
//  .then(() => {
//    const server = app.listen(process.env.PORT || 3000, function() {
//      console.log("server started on port", server.address().port);
//    });
//    app.get("/", (req, res) => {
//      let randomArt = Math.floor(Math.random() * artWorks.length);
//      res.render("index", {
//        randomArt: randomArt,
//        artWorks: artWorks
//      })
//    })
//    exports.artWorks = artWorks
//  })
//  .catch(console.error);

////GET request for user login page
//app.get("/login", (req, res) => {
//  res.render("login")
//});

////POST from login form to verify user and redirect to home or upload page
//app.post('/login', (req, res) => {
//  passport.authenticate('local', (err, user, info) => {
//     if (user) {
//       req.login(user, (err) => {
//         if (!err) {
//           res.redirect('/upload');
//         } else {
//           res.redirect('/login');
//         }
//       });
//     } else {
//       res.redirect('/login');
//     }
//   })(req, res);
// });

////upload page GET request
//app.get("/upload", (req, res) => {

//  //filters all artworks into category then sub-category
//  var paintings = artWorks.filter(artWork => artWork.imgCategory === "Painting")
//  var digitalMedia = artWorks.filter(artWork => artWork.imgCategory === "Digital")
//  var drawings = artWorks.filter(artWork => artWork.imgCategory === "Drawing")
//  var photos = artWorks.filter(artWork => artWork.imgCategory === "Photography")

//  var paintSub = _.groupBy(paintings, (e) => e.subCat.replace(/&/g, "\&"));
//  var digitalSub = _.groupBy(digitalMedia, (e) => e.subCat.replace(/&/g, "\&"));
//  var drawSub = _.groupBy(drawings, (e) => e.subCat.replace(/&/g, "\&"));
//  var photoSub = _.groupBy(photos, (e) => e.subCat.replace(/&/g, "\&"));

//  if (req.isAuthenticated()) {
//    res.render("upload", {
//      artWorks: artWorks,
//      paintSub: paintSub,
//      digitalSub: digitalSub,
//      drawSub: drawSub,
//      photoSub: photoSub
//    });
//  } else {
//    res.redirect("/login")
//  }

//});

////init Multer middleware to write user inputted file to local storage for upload to google database

//var localStorage = multer.diskStorage({
//  destination: function(req, file, cb) {
//    const {categories, subcat} = req.body
//    const subCategory = subcat.split(" ").map(_.capitalize).join(" ").replace(/ /g, "-")
//    const imageDirect = categories + "/" + subCategory + "/";
//    var dir = "./" + imageDirect;
//    if (!fs.existsSync(dir)) {
//      fs.mkdirSync(dir);
//    }
//    cb(null, imageDirect)
//  },
//  filename: function(req, file, cb) {
//    let tempImageName = file.originalname;
//    req.imageName = tempImageName
//    cb(null, tempImageName.replace(/ /g, "-"))
//  }
//});

//var upload = multer({
//  storage: localStorage
//});

////POST request from upload page to upload image

//app.post("/upload", upload.single("image"), (req, res) => {
//  //combines form inputs to create a filename for google cloud
//  const {categories, subcat, name} = req.body;
//  const subCat = subcat.split(" ").map(_.capitalize).join(" ").replace(/ /g, "-")
//  const imgName = name.split(" ").map(_.capitalize).join(" ").replace(/ /g, "-")
//  let img = req.imageName.replace(/ /g, "-");
//  let imgTitle = img.split(".")[0];
//  let imagePath = categories + '/' + subCat + '/' + img
//  const thumbTitle = imgTitle + "-thumb.jpg"

//  //uploads thumbnail
//  async function uploadThumb() {
//    await storage.bucket(thumbs).upload(thumbTitle, {
//      metadata: {cacheControl: "no-cache"},
//      gzip: true,
//      destination: categories + "/" + subCat + "/" + imgName + "-thumb.jpg"
//    })
//    uploadFile().catch(console.error);
//    fs.unlinkSync(imgTitle + "-thumb.jpg")
//  }

//  //uploads full-size image
//  async function uploadFile() {
//    await storage.bucket(bucketName).upload(imagePath, {
//      metadata: {cacheControl: "no-cache"},
//      gzip: true,
//      destination: categories + "/" + subCat + "/" + imgName + ".jpg"
//    })
//    fs.unlinkSync(`${categories}/${subCat}/${img}`)
//    fs.rmdirSync(`./${categories}/${subCat}/`)
//    setTimeout(() => {
//      fs.rmdirSync(`./${categories}`)
//    }, 500)
//    await listFiles().catch(console.error);
//  }

//  //sharp middleware creates a thumbnail image to upload to google cloud
//  sharp(imagePath)
//    .resize(null, 300).toFile(thumbTitle, (err) => {
//      if (!err) console.log("image resized");
//      uploadThumb().catch(console.error);
//    })

//  res.redirect("/upload#upload");
//});

////POST request from upload page to delete file from google cloud
//app.post("/delete", (req, res) => {
//  let imgUrl = req.body.image.split("/")
//  let thumb = imgUrl[4] + "/" + imgUrl[5] + "/" + imgUrl[6]
//  let image = thumb.split("-thumb")[0] + thumb.split("-thumb")[1]
//  async function deleteFile() {
//    await storage.bucket(thumbs).file(thumb).delete();
//    console.log(thumb + " was deleted");
//    await storage.bucket(bucketName).file(image).delete();
//    console.log(image + " was deleted");
//    await listFiles().catch(console.error)
//  }
//  deleteFile().catch(console.error);
//  res.redirect("/upload#delete")
//})

////POST request from upload page to update existing file in google cloud
//app.post("/update", (req, res) => {
//  //combines form data to create a file name that exists in google cloud
//  const {oldImage, subcatUp, upCat, nameUp} = req.body
//  let oldImg = oldImage.split("/")
//  let oldSrc = oldImg[4] + "/" + oldImg[5] + "/" + oldImg[6].split("-thumb.jpg")[0];
//  const subCat = subcatUp.split(" ").map(_.capitalize).join(" ").replace(/ /g, "-")
//  let newSrc = upCat + "/" + subCat + "/" + nameUp.replace(/ /g, "-")

//  //changes old file to new file by changing location in google cloud bucket
//  async function moveFile() {
//    await storage.bucket(thumbs).file(oldSrc + "-thumb.jpg").move(newSrc + "-thumb.jpg")
//    console.log("thumb moved from " + oldSrc + " to " + newSrc);
//    await storage.bucket(bucketName).file(oldSrc + ".jpg").move(newSrc + ".jpg")
//    console.log("image moved from " + oldSrc + " to " + newSrc);
//    await listFiles().catch(console.error);
//  }

//  moveFile().catch(console.error);
//  res.redirect('/upload#delete')
//})

//// Get request for main art pages
//app.get("/:category", (req, res) => {
//  var page = _.capitalize(req.params.category)
//  const category = artWorks.filter(artWork => artWork.imgCategory === page)
//  const subCated = _.groupBy(category, e => e.subCat)
//  const description = titleDesc.filter(item => item.page === page)
//  res.render("template", {
//    subCated: subCated,
//    subCategoryList: Object.keys(subCated),
//    pageType: description[0]
//  })
//})
