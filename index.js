const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const express = require("express");
const { getStorage } = require("firebase-admin/storage");
const { createImage } = require("./utils");
const cors = require("cors");

const app = express();

const port = 5000;
app.use(cors());
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "testerdemo-888a3.appspot.com",
});

const storage = getStorage();

app.get("/", async (req, res) => {
  const { url } = req.query;
  if (url === undefined) {
    res.send({
      status: "error",
      message: "url is required",
    });
  }
  const _urll =
    url ??
    "https://firebasestorage.googleapis.com/v0/b/testerdemo-888a3.appspot.com/o/cktest-sg%2Fd7cc432c1fa7470d8a818c74466ce548.png?alt=media&token=6dd322ea-19e0-4583-855c-d31223aff413";

  const imageBuffer = await createImage(_urll);

  const bucket = getStorage().bucket();

  const file = bucket.file("ck/" + Date.now() + ".png");
  const options = {
    metadata: {
      contentType: "image/png", // Set the content type appropriately for a PNG image
    },
  };

  file.save(imageBuffer, options, function (err) {
    if (err) {
      res.send("not ok");
      return;
    }

    // get public url
    file
      .getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      })
      .then((url) => {
        res.send(url[0]);
      });
  });
});
