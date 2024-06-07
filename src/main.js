const express = require("express");
const venom = require("venom-bot");

const app = express();
const port = 3000;

// Middleware untuk parsing JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let client;

// Buat sesi Venom-Bot
venom
  .create({
    session: "ryoogen-session-whatsapp", // nama sesi
  })
  .then((venomClient) => {
    client = venomClient;
    startServer();
  })
  .catch((erro) => {
    console.log("Error starting Venom:", erro);
  });

app.get("/api/getuser", async (req, res, next) => {
  return res.status(200).json({ kocak: "sdfsa" });
});

app.post("/api/send-text", async (req, res, next) => {
  if (!client) {
    return res.status(500).json({ error: "Venom client not initialized" });
  }

  const { from, text } = req.body;

  try {
    const result = await client.sendText(from, text); // Menggunakan req.body.form
    res.status(200).json({ data: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/send-image", async (req, res, next) => {
  if (!client) {
    return res.status(500).json({ error: "Venom client not initialized" });
  }

  const { from, image, image_name, caption } = req.body;

  try {
    const result = await client.sendImage(from, image, image_name, caption);
    res.status(200).json({ data: result });
  } catch (e) {
    console.error("Error sending image:", e);
    res.status(500).json({ error: e.message });
  }
});

function startServer() {
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}
