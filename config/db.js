const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Berhasil Tersambung ke DB");
      });
  } catch (err) {
    console.error("Error saat menyambungkan ke DB", err.message);
  }
};

module.exports = connectToMongoDB;
