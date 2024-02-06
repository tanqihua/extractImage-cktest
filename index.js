const admin = require("firebase-admin");
const serviceAccount = require("./xcs-cloud-firebase-adminsdk-wujtf-7b2d30ee07.json");
const WebSocket = require("ws");

const express = require("express");
const { getStorage } = require("firebase-admin/storage");
const { createImage } = require("./utils");
const cors = require("cors");

// websocket
// Import the ws library
// Create a WebSocket server
const app = express();
const wss = new WebSocket.Server({ noServer: true });

app.use(cors());
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

httpServer.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

let connectedClients = [];
// Set up a connection listener
wss.on("connection", (ws) => {
  // When a message is received from a client
  connectedClients.push(ws);
  ws.on("message", (message) => {
    console.log("Received: %s", message);
  });

  ws.on("close", () => {
    // delete all client
    connectedClients = connectedClients.filter((client) => client !== ws);
  });

  // Send a message to the client
  ws.send("Hello from server!");
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "xcs-cloud.appspot.com",
});

// connect to websocket

let sequance = 0;
const db = admin.firestore();

function addTask(url, email) {
  let task = url; // Assuming the URL is stored in a field named 'url'
  sequance += 1;
  let ramain = sequance % connectedClients.length;
  if (connectedClients.length > 0) {
    connectedClients.forEach((client, index) => {
      if (ramain === index) {
        client.send([task, sequance, ramain, index, email].toString());
      }
    });
  }
}

app.get("/add", (req, res) => {
  const { url, email } = req.query;
  addTask(url, email ?? "tan.qihua17@gmial.com");
  res.send("ok");
});

app.get("/faceswap", async (req, res) => {
  const { url, colorTone } = req.query;
  if (url === undefined) {
    res.send({
      status: "error",
      message: "url is required",
    });
  }

  // if (connectedClients.length === 0) {
  //   res.send({
  //     status: "error",
  //     message: "no client connected",
  //   });
  // }
  // addTask(url[0], email);

  const _urll = url;
  const imageBuffer = await createImage(_urll, colorTone);

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
        res.send(
          JSON.stringify({
            status: "ok",
            url: url[0],
          })
        );
      });
  });
});

let count = 0;

app.get("/count", (req, res) => {
  count += 1;
  res.send(count.toString());
});
