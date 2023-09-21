const https = require("https");
const fs = require("fs");
const express = require("express");
const Connection = require("./config/db");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reimburseRoutes = require("./routes/reimburseRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

Connection();

app.use("/dashboard", dashboardRoutes);
app.use("/reimbursement", reimburseRoutes);
app.use("/leave", leaveRoutes);

// Membaca certificate and private key yang didapat dari openssl
const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.crt", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
};

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 8443;
const HOST = process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";

// Start the HTTP server
app.listen(HTTP_PORT, HOST, () => {
  console.log(`HTTP server is running on http://${HOST}:${HTTP_PORT}`);
});

// Start the HTTPS server
httpsServer.listen(HTTPS_PORT, HOST, () => {
  console.log(`HTTPS server is running on https://${HOST}:${HTTPS_PORT}`);
});
