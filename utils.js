const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const https = require("https");
const Replicate = require("replicate");
const masking = new Canvas.Image();
masking.src = fs.readFileSync("./images/CG_fullmask.png");
// r8_FEXRJiQRyY9ljSC3dOWqZDlph1gRXkQ0lTzhP

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

const ReplicateAIP = async (target, colorTone) => {
  let colorToneImg;
  return "https://firebasestorage.googleapis.com/v0/b/xcs-cloud.appspot.com/o/ck-img%2F27102da2eb7c41c5a32f032c764383670.0928829326036591.jpg?alt=media&token=c3ae8c89-ec45-4eb3-b9b0-5bef4b0abfee";

  switch (colorTone) {
    case "#5F463A":
      colorToneImg = "https://i.ibb.co/1TwKdMC/Demo01.jpg";
      break;
    case "#A96636":
      colorToneImg = "https://i.ibb.co/1TwKdMC/Demo01.jpg";
      break;
    case "#EAC098":
      colorToneImg = "https://i.ibb.co/1TwKdMC/Demo01.jpg";
      break;
    case "#F9D2A2":
      colorToneImg = "https://i.ibb.co/1TwKdMC/Demo01.jpg";
      break;

    default:
      colorToneImg = "https://i.ibb.co/1TwKdMC/Demo01.jpg";
      break;
  }

  try {
    const output = await replicate.run(
      "omniedgeio/face-swap:c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe",
      {
        input: {
          swap_image: target,
          target_image: colorToneImg,
        },
      }
    );

    return output;
  } catch (error) {
    return "https://firebasestorage.googleapis.com/v0/b/xcs-cloud.appspot.com/o/ck-img%2F27102da2eb7c41c5a32f032c764383670.0928829326036591.jpg?alt=media&token=c3ae8c89-ec45-4eb3-b9b0-5bef4b0abfee";
  }
};

async function createImage(url, colorTone) {
  // Usage
  let _url = await ReplicateAIP(url, colorTone);
  let buffer = await getImageBuffer(_url);

  const img = new Canvas.Image();
  img.src = buffer;

  // before
  const canvas = Canvas.createCanvas(768, 1024);
  const ctx = canvas.getContext("2d");

  // masking
  ctx.drawImage(masking, 0, 0, 768, 1024);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, 0, 0, 768, 1024);

  const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data2 = imageData2.data;

  // get all pixel data

  // change pixel data
  for (let i = 0; i < data.length; i += 4) {
    // get rgb
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a <= 100) {
      data2[i] = 0;
      data2[i + 1] = 0;
      data2[i + 2] = 0;
      data2[i + 3] = 0;
    }
  }
  // put data back
  ctx.putImageData(imageData2, 0, 0);

  const imageBuffer = canvas.toBuffer("image/png", { quality: 0.8 });

  return imageBuffer;
}

module.exports = {
  createImage,
};

async function main() {
  let _url = "https://i.ibb.co/Jz7Sx6P/image.png";
  let imageBuffer = await createImage(_url, "#ffffff");

  fs.writeFileSync("./test.png", imageBuffer);
}
