const Reimburse = require("../models/reimburseModel");

exports.getAllReimburse = async (req, res) => {
  try {
    const reimburses = await Reimburse.find();
    if (reimburses.length > 0) {
      res
        .status(200)
        .json({ message: "Data reimburse ditemukan.", data: reimburses });
    } else {
      res.status(400).json({ message: "Data reimburse belum ada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.addReimburse = async (req, res) => {
  try {
    const reimburse = await Reimburse.create(req.body);
    res
      .status(201)
      .json({ message: "Pembuatan reimburse berhasil", data: reimburse });
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};
