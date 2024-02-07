const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const https = require("https");
const Replicate = require("replicate");
const masking = new Canvas.Image();
masking.src = fs.readFileSync("./images/CG_fullmask.png");
// r8_FEXRJiQRyY9ljSC3dOWqZDlph1gRXkQ0lTzhP

const replicate = new Replicate({
  auth: "r8_QdHpitQeAHOwPRjSwW5HNgU5PgIlXsB3C43Ou",
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
  // return "https://i.ibb.co/D8TCdcY/Demo01.jpg";

  switch (colorTone) {
    case "#5F463A":
      colorToneImg = "https://i.ibb.co/D8TCdcY/Demo01.jpg";
      break;
    case "#A96636":
      colorToneImg = "https://i.ibb.co/D8TCdcY/Demo01.jpg";
      break;
    case "#EAC098":
      colorToneImg = "https://i.ibb.co/D8TCdcY/Demo01.jpg";
      break;
    case "#F9D2A2":
      colorToneImg = "https://i.ibb.co/D8TCdcY/Demo01.jpg";
      break;

    default:
      colorToneImg = "https://i.ibb.co/D8TCdcY/Demo01.jpg";
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
    return "https://i.ibb.co/D8TCdcY/Demo01.jpg";
  }
};

async function createImage(url, colorTone) {
  // Usage
  let _url = await ReplicateAIP(url, colorTone);
  let buffer = await getImageBuffer(_url);

  const img = new Canvas.Image();
  img.src = buffer;

  // before
  const canvas = Canvas.createCanvas(1920, 1080);
  const ctx = canvas.getContext("2d");

  // masking
  ctx.drawImage(masking, 0, 0, 1920, 1080);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, 0, 0, 1920, 1080);

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

main();
