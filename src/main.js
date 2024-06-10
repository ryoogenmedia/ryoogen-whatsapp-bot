const bodyParser = require("body-parser");
const express = require("express");
const venom = require("venom-bot");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let client;

var infoAttempts;
var base64QR;
var statusSessionScan;
var sessionName;

// Mulai server Express segera
startServer();

// Inisialisasi Venom
venom
  .create(
    {
      session: "ryoogen-session-whatsapp",
    },
    (base64Qrimg, asciiQR, attempts, urlCode) => {
      infoAttempts = attempts;
      base64QR = base64Qrimg;
    },
    (statusSession, session) => {
      statusSessionScan = statusSession;
      sessionName = session;
    }
  )
  .then((venomClient) => {
    client = venomClient;
    console.log("Venom client initialized successfully");
  })
  .catch((erro) => {
    console.log("Error starting Venom:", erro);
  });

// *HELPERS FUNCTION
/**
 *
 * @param {object} client
 * @param {*} res
 * @returns object
 */
function checkClient(client, res) {
  if (!client) {
    return res.status(500).json({ error: "Venom client not initialized" });
  }
}

/**
 * DEVICE API
 */

app.get("/api/device/disconnect", async (res, next) => {
  checkClient(client);

  const result = await client.logout();

  try {
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
});

app.get("/api/device/delete", async (res, next) => {
  checkClient(client);

  const result = await client.killServiceWorker();

  try {
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
});

app.get("/api/device/restart", async (res, next) => {
  checkClient(client);

  const result = client.restartService();

  try {
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
});

app.get("/api/device/connection-state", async (res, next) => {
  checkClient(client);

  const result = client.getConnectionState();

  try {
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
});

app.get("/api/device/battery", async (res, next) => {
  checkClient(client);

  const result = client.getBatteryLevel();

  try {
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    res.status(505).json({
      error: e.message,
    });
  }
});

app.get("/api/device/status-connected", async (res, next) => {
  const result = client.isConnected();

  try {
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
});

/**
 * GET QR CODE & STATUS
 */
app.get("/api/get-qrcode", async (res, next) => {
  if (client) {
    res.status(200).json({
      status_session: statusSessionScan,
      sessionName: sessionName,
    });
  } else {
    res.status(200).json({
      qr: {
        base64: base64QR,
        attempts: infoAttempts,
      },
      status_session: statusSessionScan,
      sessionName: sessionName,
    });
  }

  res.status(500).json({
    error: "error whatsapp server bot ryoogen media",
  });
});

/**
 * API SEND (TEXT, IMAGE)
 */
app.post("/api/send/text", async (req, res, next) => {
  checkClient(client, res);

  const { from, text } = req.body;

  try {
    const result = await client.sendText(from, text);
    res.status(200).json({ data: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/send/image", async (req, res, next) => {
  checkClient(client, res);

  const { from, image, image_name, caption } = req.body;

  try {
    const result = await client.sendImage(from, image, image_name, caption);
    res.status(200).json({ data: result });
  } catch (e) {
    console.error("Error sending image:", e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * HELPERS START SERVER EXPRESS JS
 */
function startServer() {
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}
