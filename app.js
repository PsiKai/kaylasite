const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const path = require("path");
const ejs = require("ejs");
const Jimp = require("jimp");
const sharp = require('sharp');
// const gm = require("gm");
const multer = require("multer");
const fs = require("file-system");
const imageThumbnail = require("image-thumbnail");
const {Storage} = require('@google-cloud/storage');

// const projectId = 'project_id';
// const keyFilename = "auth.json";
// const projectId = process.env.PROJECT_ID;
// const key = process.env.API_KEY;
const storage = new Storage();
// {keyFilename: "auth.json"}


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
    description: "I love to paint with water colors but I also do a lot with acrylic.  You can see in this section how my love of animals inspires so much of my art. Some of these paintings are commissioned pet portraits from other animal lovers, and some are professional works I've done for clients, including one of the children's books I illustrated. My favorite work here might be from the Dragon Boat Festival in Nashville where my design was picked for one of the official posters of the event!"
  }, {
    title: "Photography",
    description: "Ask anyone who knows me and they'll tell you how much I enjoy doing photoshoots.  Whether it's exploring nature and finding lots of critters, or dressing up my friends and family in wild costumes so they can be models.  I've even done more serious work like senior portraits and professional profile pictures.  Of course you can't forget the countless pictures of my cats and all the kittens I foster.  I just love to find something beautiful and capture it with photography."
  }, {
    title: "Drawing",
    description: "I have always been drawing or doodling and I have filled countless sketchbooks in my life.  Between the sketches, graphic novellas, children's books, and even some branding work, I have narrowed it down to just the favorites.  Colored pencil and graphite are my primary media, and my signature sketch is my dhalia flower, which is present in so much of my drawing.  Nature and fantasy are huge inspirations for the work that I do, and I would probably draw dragons and flowers all day if I could!"
  }, {
    title: "Digital Media",
    description: "When I got to college it was time to take on a new challenge in my artistic development.  The idea of digital art was out side my realm, but it was required for my degree in Commercial Illustration.  That isn't to say that I didn't have a ton of fun learning and creating in this new medium!  I especially enjoyed digital painting, but I also became an experienced vector-art designer and even did some 3d modeling.  In my career I designed logos, business cards, car wraps, and just about everything in print media."
  }
];


async function listFiles() {
  artWorks = [];
  const [files] = await storage.bucket(bucketName).getFiles();
  files.forEach(file => {
      var string = file.name.split("/");
      artWorks.push(
        {
          imgCategory: string[0],
          subCat: string[1].replace(/-/g, ' '),
          imgSrc: bucket + file.name,
          thumbnail: thumbBucket + file.name.split('.')[0] + "-thumb.jpg",
          alt: string[2]
        });
  });
  console.log("files listed");
}


listFiles()
  .then(() => {
    const server = app.listen(3000, function() {
      console.log("server started on port", server.address().port);
    });
    app.get("/", function(req, res) {
      let randomArt = Math.floor(Math.random()*artWorks.length);
      res.render("index", {
        randomArt: randomArt,
        artWorks: artWorks
      })
    })
  })
  .catch(console.error);


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
    await storage.bucket(thumbs).upload(imgTitle + "-thumb.jpg", {metadata: {cacheControl: "no-cache"}, gzip: true, destination: cat + "/" + subCat + "/" + req.body.name.replace(/ /g, "-") + "-thumb.jpg"})
      uploadFile().catch(console.error);
      fs.unlinkSync(imgTitle + "-thumb.jpg")
  }

  async function uploadFile() {
    await storage.bucket(bucketName).upload(imagePath, {metadata: {cacheControl: "no-cache"}, gzip: true, destination: cat + "/" + subCat + "/" + req.body.name.replace(/ /g, "-") + ".jpg"})
      fs.unlinkSync(`${cat}/${subCat}/${img}`)
      fs.rmdirSync(`./${cat}/${subCat}/`)
      setTimeout(() => {
        fs.rmdirSync(`./${cat}`)
      }, 500)
    await listFiles().catch(console.error);
  }

  sharp(imagePath)
    .resize(null, 300).toFile(imgTitle + "-thumb.jpg", function(err) {
      if (!err) console.log("image resized");
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


app.post("/update", (req, res) => {
  let oldImg = req.body.oldImage.split("/")
  let oldSrc = oldImg[4] + "/" + oldImg[5] + "/" + oldImg[6].split("-thumb.jpg")[0];
  let newSubcat = req.body.subcatUp.split(" ")
  let subCat = ''
  for (i=0; i < newSubcat.length; i++) {
    var eachWord = newSubcat[i].charAt(0).toUpperCase() + newSubcat[i].slice(1);
    if (i < newSubcat.length-1) {
    subCat = subCat.concat(eachWord + "-");
    } else {
    subCat = subCat.concat(eachWord);
    }
  }
  let newSrc = req.body.upCat + "/" + subCat + "/" + req.body.nameUp.replace(/ /g, "-")

  async function moveFile() {
    await storage.bucket(thumbs).file(oldSrc + "-thumb.jpg").move(newSrc + "-thumb.jpg")
      console.log("thumb moved from " + oldSrc + " to " + newSrc);
    await storage.bucket(bucketName).file(oldSrc + ".jpg").move(newSrc + ".jpg")
      console.log("image moved from " + oldSrc + " to " + newSrc);
    await listFiles().catch(console.error);
  }

  moveFile().catch(console.error);
  res.redirect('/upload#delete')
})
