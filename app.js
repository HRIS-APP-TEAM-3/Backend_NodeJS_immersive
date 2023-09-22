const express = require("express");
const cors = require("cors");
const Connection = require("./config/db");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reimburseRoutes = require("./routes/reimburseRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const keyResultRoutes = require("./routes/keyResultRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

Connection();

app.use(cors());
app.use("/dashboard", dashboardRoutes);
app.use("/reimbursement", reimburseRoutes);
app.use("/leave", leaveRoutes);
app.use("/keyresult", keyResultRoutes);

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HOST = process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";

// Start the HTTP server
app.listen(HTTP_PORT, HOST, () => {
  console.log(`HTTP server is running on http://${HOST}:${HTTP_PORT}`);
});
