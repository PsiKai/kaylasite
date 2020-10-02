const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash")
const ejs = require("ejs");
const Jimp = require("jimp");
const sharp = require('sharp');
const multer = require("multer");
const fs = require("file-system");
const imageThumbnail = require("image-thumbnail");
const {Storage} = require('@google-cloud/storage');

const projectId = 'project-id';
const keyFileName = "client_secret.json";
const storage = new Storage({projectId, keyFileName});



const app = express();

app.set('view engine', "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

const bucketName = 'kayla-art';
const thumbs = 'thumbnail-art';
const bucket = "https://storage.googleapis.com/kayla-art/";
const thumbBucket = "https://storage.googleapis.com/thumbnail-art/";
let artWorks = [];

let titleDesc = [
  {
    title: "Painting",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }, {
    title: "Photography",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }, {
    title: "Drawing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }, {
    title: "Digital Media",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];




async function listFiles() {
  artWorks = [];
  const [files] = await storage.bucket(bucketName).getFiles();
  files.forEach(file => {
    function splitStr(str) {
      var string = str.split("/");
      artWorks.push(
        {
          imgCategory: string[0],
          subCat: string[1].replace(/-/g, ' '),
          imgSrc: bucket + file.name,
          thumbnail: thumbBucket + file.name.split('.')[0] + "-thumb.jpg",
          alt: string[2]
        });
    }
    var str = file.name;
    splitStr(str);
    // Jimp.read(bucket + file.name, (err, img) => {
    //   if (err) throw err
    //   img.resize(Jimp.AUTO, 300).write(file.name.split(".")[0] + "-thumb.jpg")
    // })
    // async function uploadThumb() {
    //   await storage.bucket(thumbs).upload(file.name.split('.')[0] + "-thumb.jpg", {destination: file.name.split(".")[0] + "-thumb.jpg"})
    // }
    // setTimeout(() => {
    //   uploadThumb().catch(console.error);
    // }, 2000)
    // setTimeout(() => {
    //   fs.unlinkSync(file.name.split('.')[0] + "-thumb.jpg")
    // }, 5000)
  });
  console.log("files listed");
}

listFiles().catch(console.error);
// setInterval(function(){
//   artWorks = [];
//   listFiles().catch(console.error); }, 60000);






app.get("/", function(req, res) {
  let randomArt = Math.floor(Math.random()*artWorks.length);

    res.render("index", {
    randomImg: artWorks[randomArt].thumbnail,
    imgCategory: artWorks[randomArt].imgCategory,
    artWorks: artWorks
  });
});


app.get("/painting", function(req, res) {

  var paintings = artWorks.filter(function(artWork) {
    return artWork.imgCategory === "Painting"
  });
  var subCated = _.groupBy(paintings, function(e) {
      return e.subCat;
    });
  res.render("template", {
    subCated: subCated,
    subCategoryList: Object.keys(subCated),
    pageType: titleDesc[0],
  });
});



app.get("/photography", function(req, res) {
  var photos = artWorks.filter(function(artWork) {
    return artWork.imgCategory === "Photography"
  });
  var subCated = _.groupBy(photos, function(e) {
      return e.subCat;
    });
  res.render("template", {
    subCated: subCated,
    subCategoryList: Object.keys(subCated),
    pageType: titleDesc[1],
  });
});


app.get("/drawing", function(req, res) {
  var drawings = artWorks.filter(function(artWork) {
    return artWork.imgCategory === "Drawing"
  });
  var subCated = _.groupBy(drawings, function(e) {
      return e.subCat;
    });
  res.render("template", {
    subCated: subCated,
    subCategoryList: Object.keys(subCated),
    pageType: titleDesc[2],
  });
});


app.get("/digital", function(req, res) {
  var digitalMedia = artWorks.filter(function(artWork) {
    return artWork.imgCategory === "Digital"
  });
  var subCated = _.groupBy(digitalMedia, function(e) {
      return e.subCat;
    });
  res.render("template", {
    subCated: subCated,
    subCategoryList: Object.keys(subCated),
    pageType: titleDesc[3],
  });
});


app.get("/upload", function(req, res) {

  var paintings = artWorks.filter(function(artWork) {
    return artWork.imgCategory === "Painting"
  });
  var digitalMedia = artWorks.filter(function(artWork) {
    return artWork.imgCategory === "Digital"
  });
  var drawings = artWorks.filter(function(artWork) {
    return artWork.imgCategory === "Drawing"
  });
  var photos = artWorks.filter(function(artWork) {
    return artWork.imgCategory === "Photography"
  });
  var paintSub = _.groupBy(paintings, (e) => e.subCat);
  var digitalSub = _.groupBy(digitalMedia, (e) => e.subCat.replace(/ /g, "-"));
  var drawSub = _.groupBy(drawings, (e) => e.subCat.replace(/&/g, "\&"));
  var photoSub = _.groupBy(photos, (e) => e.subCat);

  res.render("upload", {
    artWorks: artWorks,
    paintSub: paintSub,
    digitalSub: digitalSub,
    drawSub: drawSub,
    photoSub: photoSub
  });
});

var localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const imageDirect = req.body.categories + "/" + req.body.subcat.charAt(0).toUpperCase() + req.body.subcat.slice(1).replace(/ /g, "-") + "/";
    var dir = "./" + imageDirect;
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, imageDirect)
  },
  filename: function (req, file, cb) {
    let tempImageName = file.originalname;
    req.imageName = tempImageName
    cb(null, tempImageName.replace(/ /g, "-"))
  }
});

var upload = multer({storage: localStorage});

app.post("/upload", upload.single("image"), (req, res) => {
  let cat = req.body.categories;
  let subCatLiteral = req.body.subcat.split(" ");
  let subCat = ""
  for (i=0; i < subCatLiteral.length; i++) {
    var eachWord = subCatLiteral[i].charAt(0).toUpperCase() + subCatLiteral[i].slice(1);
    if (i < subCatLiteral.length-1) {
    subCat = subCat.concat(eachWord + "-");
    } else {
    subCat = subCat.concat(eachWord);
    }
  }
  let img = req.imageName.replace(/ /g, "-");
  let imgTitle = img.split(".")[0];
  let imagePath = cat + '/' + subCat + '/' + img

  async function uploadThumb() {
    await storage.bucket(thumbs).upload(imgTitle + "-thumb.jpg", {gzip: true, destination: cat + "/" + subCat + "/" + req.body.name.replace(/ /g, "-") + "-thumb.jpg"})
      uploadFile().catch(console.error);
      fs.unlinkSync(imgTitle + "-thumb.jpg")
  }

  async function uploadFile() {
    await storage.bucket(bucketName).upload(imagePath, {resumable: true, gzip: true, destination: cat + "/" + subCat + "/" + req.body.name.replace(/ /g, "-") + ".jpg"})
      fs.unlinkSync(`${cat}/${subCat}/${img}`)
      fs.rmdirSync(`./${cat}/${subCat}/`)
      setTimeout(() => {
        fs.rmdirSync(`./${cat}`)
      }, 500)
    listFiles();
  }

  sharp(imagePath)
    .resize(null, 300).toFile(imgTitle + "-thumb.jpg", function(err) {
      uploadThumb().catch(console.error);
  })

  res.redirect("/upload#upload");
});

app.post("/delete", (req, res) => {
    let imgUrl = req.body.image.split("/")
    let thumb = imgUrl[4] + "/" + imgUrl[5] + "/" + imgUrl[6]
    let image = thumb.split("-thumb")[0] + thumb.split("-thumb")[1]
    async function deleteFile() {
      await storage.bucket(thumbs).file(thumb).delete();
        console.log(thumb + " was deleted");
      await storage.bucket(bucketName).file(image).delete();
        console.log(image + " was deleted");
      await listFiles().catch(console.error)
    }
    deleteFile().catch(console.error);
    res.redirect("/upload#delete")
})


const server = app.listen(3000, function() {
  console.log("server started on port", server.address().port);
});
