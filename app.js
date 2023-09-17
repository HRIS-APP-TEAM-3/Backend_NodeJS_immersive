const express = require("express");
const Connection = require('./config/db')
const dashboardRoutes = require("./routes/dashboardRoutes");
const reimburseRoutes = require("./routes/reimburseRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

Connection();

app.use("/dashboard", dashboardRoutes);
app.use("/reimbursement", reimburseRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
