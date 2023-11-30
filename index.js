const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const express = require("express");
const { getStorage } = require("firebase-admin/storage");
const { createImage } = require("./utils");
const app = express();

const port = 5000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "unity-coach-holiday.appspot.com",
});

// Get a reference to the storage bucket
const bucket = admin.storage().bucket();

app.get("/getImg", async (req, res) => {
  const { url } = req.query;

  await createImage(url, (_imageBuffer) => {
    // store to firebase
    const bucket = getStorage().bucket();

    const file = bucket.file("cktest-sg/" + Date.now() + ".png");
    const options = {
      metadata: {
        contentType: "image/png", // Set the content type appropriately for a PNG image
      },
    };

    // Upload the buffer to Firebase Storage
    file.save(_imageBuffer, options, (err) => {
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
          res.send(url);
        });
    });
  });
});
