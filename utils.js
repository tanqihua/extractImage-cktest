const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const https = require("https");
const Replicate = require("replicate");
const masking = new Canvas.Image();
masking.src = fs.readFileSync("./images/masking.png");

async function createImage(url, callBack = () => {}) {
  // Usage
  let _url = await ReplicateAIP(url);
  getImageBuffer(_url)
    .then((buffer) => {
      const img = new Canvas.Image();

      img.src = buffer;

      // before
      const canvas = Canvas.createCanvas(1920, 1080);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, 1920, 1080);

      // masking
      ctx.drawImage(masking, 0, 0, 1920, 1080);

      // get all pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // change pixel data
      for (let i = 0; i < data.length; i += 4) {
        // get rgb
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (g >= 100 && r < 100 && b < 100) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
        }
      }
      // put data back
      ctx.putImageData(imageData, 0, 0);

      const imageBuffer = canvas.toBuffer("image/png", { quality: 0.8 });
      callBack(imageBuffer);
    })
    .catch((err) => {
      console.error(err);
    });
}

// let imgg = createImage(
//   "https://storage.googleapis.com/replicate-files/TZsTL6ghqF5iJVVErnO3OhlrPeiKfwvSdGbcReTTDYvGiL6jA/6c60e956-faad-470e-98c4-8d387191af3c.jpg"
// );
// fs.writeFileSync("./images/test.png", imgg);

function getImageBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const dataChunks = [];
        res.on("data", (chunk) => {
          dataChunks.push(chunk);
        });
        res.on("end", () => {
          resolve(Buffer.concat(dataChunks));
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

const replicate = new Replicate({
  auth: "r8_ErBf6Pi4cMtEMqkvThTB6dQHikGUKSU4SbJV9",
});

const ReplicateAIP = async (target) => {
  const output = await replicate.run(
    "yan-ops/face_swap:a7d6a0118f021279b8966473f302b1d982fd3920426ebd334e8f64d5caf84418",
    {
      input: {
        det_thresh: 0.1,
        request_id: "",
        target_image:
          "https://firebasestorage.googleapis.com/v0/b/testerdemo-888a3.appspot.com/o/cktest-sg%2Fmodel_transparent.png?alt=media&token=48f2e9fd-6852-4850-b1ac-9574685b83e8",
        source_image: target,
      },
    }
  );

  return output.image;
};

module.exports = {
  createImage,
};
