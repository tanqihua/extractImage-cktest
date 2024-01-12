const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
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
const port = 5000;
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
  storageBucket: "testerdemo-888a3.appspot.com",
});

// connect to websocket

app.get("/test", async (req, res) => {
  const { task } = req.query;
  let url =
    "https://storage.googleapis.com/testerdemo-888a3.appspot.com/ck/1704875938738.png?GoogleAccessId=firebase-adminsdk-6at00%40testerdemo-888a3.iam.gserviceaccount.com&Expires=16446988800&Signature=Mg%2Ftk9tmWum58EXfZ1yYvygl36UyIMWYlaJfp%2Bv6sO%2Bk%2FCSKScB8C8UMBcs2RUW91tBI10Yf%2B4FOP0aXnFTJceuColA4a4sS9U4BBwfkFG3H2lBHDA76zsBhOzoqgppvF8FxUjB2B2c9P68ERWPCMcP57MItnsGOHEplckFb%2FqnhyQUXEFX6q3Ap%2BvXDYyx3Yc%2Bprdz7bBot9ZbNSxHGCgnLcDLkyfKY9NHG7BuIHmlIU4QUeXW0lMuHvo4ltUWxEbg%2FG1nMcFCpCgZXTvEMAgg6JUIhR%2FnTKjO6dTbKHFYonKmbG6jons2NwQ006s7uMop4f70ukEovxHVuD4su8g%3D%3D";

  connectedClients.forEach((client) => {
    client.send(url);
  });

  res.send({
    status: "ok",
  });
});

let sequance = 0;

function addTask(task) {
  // Distribute tasks if there are connected clients
  sequance += 1;
  let ramain = sequance % connectedClients.length;
  if (connectedClients.length > 0) {
    connectedClients.forEach((client, index) => {
      if (ramain === index) {
        client.send([task, sequance, ramain, index].toString());
      }
    });
  }
}
// when task is not empty

app.get("/", async (req, res) => {
  const { url } = req.query;
  if (url === undefined) {
    res.send({
      status: "error",
      message: "url is required",
    });
  }

  if (connectedClients.length === 0) {
    res.send({
      status: "error",
      message: "no client connected",
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
        res.send(
          JSON.stringify({
            status: "ok",
            url: url[0],
          })
        );

        addTask(url[0]);
      });
  });
});
