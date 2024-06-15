## Optional create parameters

Venom `create()` method third parameter can have the following optional parameters:

If you are using the `Linux` server do not forget to pass the args `--user-agent`
[Original parameters in browserArgs](https://github.com/orkestral/venom/blob/master/src/config/puppeteer.config.ts)

```javascript
const bodyParser = require ("body-parser");
const express = require ("express");
const venom = require ("venom-bot");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let client;

var infoAttempts;
var base64QR;
var statusSessionScan;
var sessionName;

// * START SERVER EXPRESS
startServer();

// * INITIALITATION VENOM SERVER
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
    },
    {
      browserArgs: ['--no-sandbox', '--disable-setuid-sandbox']  // Set browserArgs
    }
  )
  .then((venomClient) => {
    client = venomClient;
    console.log("Venom client initialized successfully");
  })
  .catch((erro) => {
    console.log("Error starting Venom:", erro);
  });
```
