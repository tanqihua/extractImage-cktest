const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const https = require("https");
const Replicate = require("replicate");
const masking = new Canvas.Image();
masking.src = fs.readFileSync("./images/masking.png");

const replicate = new Replicate({
  auth: "r8_ErBf6Pi4cMtEMqkvThTB6dQHikGUKSU4SbJV9",
});

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

const ReplicateAIP = async (target) => {
  const output = await replicate.run(
    "omniedgeio/face-swap:c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe",
    {
      input: {
        swap_image: target,
        target_image: "https://i.ibb.co/55CBpQS/model-transparent.png",
      },
    }
  );

  return output;
};

async function createImage(url) {
  // Usage
  let _url = await ReplicateAIP(url);
  let buffer = await getImageBuffer(_url);
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

  return imageBuffer;
}

module.exports = {
  createImage,
};
