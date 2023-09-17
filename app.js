const express = require("express");
const mongoose = require("mongoose");
const reimburseRoutes = require("./routes/reimburseRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Berhasil Tersambung ke DB");
  })
  .catch((err) => {
    console.error("Error saat menyambungkan ke DB", err.message);
  });

app.use("/reimbursement", reimburseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
