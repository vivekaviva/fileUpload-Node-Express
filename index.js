const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(express.static("./public"));

app.set("view engine", "ejs");
app.set("views", "views");

let maxSize = 2 * 1000 * 1000; // 2MB

var storages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.replace(/\.[^/.]+$/, "") +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

let uploadsss = multer({
  storage: storages,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: function (req, file, cb) {
    console.log("File details:", file);
    let filetypes = /jpeg|jpg|png/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    console.log("MIME type valid:", mimetype);
    console.log("Extension valid:", extname);

    if (mimetype && extname) {
      return cb(null, true);
    }

    // Pass an error instance to the callback
    return cb(new Error("File format is not supported"), false);
  },
}).single("uploadMyPic");

let uploadsMultiple = multer({
  storage: storages,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: function (req, file, cb) {
    console.log("File details:", file);
    let filetypes = /jpeg|jpg|png/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    console.log("MIME type valid:", mimetype);
    console.log("Extension valid:", extname);

    if (mimetype && extname) {
      return cb(null, true);
    }

    // Pass an error instance to the callback
    return cb(new Error("File format is not supported"), false);
  },
}).array("uploadMultiplePic", 3);

app.get("/", (req, res) => {
  res.send("Welcome Page");
});

app.get("/multipleUpload", (req, res) => {
  res.render("fileUploadMultiple");
});

app.post("/uploadedMultiple", (req, res) => {
  console.log("Upload endpoint hit");
  uploadsMultiple(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .send("Error: File size exceeds the maximum limit of 2MB");
        }
      } else if (err) {
        console.log("Error:", err.message);
        return res.status(500).send(`Error: ${err.message}`);
      }
    } else {
      res.send("Success. Image Uploaded!");
    }
  });
});

app.post("/uploaded", (req, res) => {
  console.log("Upload endpoint hit");
  uploadsss(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .send("Error: File size exceeds the maximum limit of 2MB");
        }
      } else if (err) {
        console.log("Error:", err.message);
        return res.status(500).send(`Error: ${err.message}`);
      }
    } else {
      res.send("Success. Image Uploaded!");
    }
  });
});

app.get("/file", (req, res) => {
  res.render("fileUpload");
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(8080, () => {
  console.log(`Server is running at port 8080`);
});
