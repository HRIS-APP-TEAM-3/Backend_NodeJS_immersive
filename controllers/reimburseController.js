const Reimburse = require("../models/reimburseModel");

exports.getAllReimburse = async (req, res) => {
  try {
    const reimburses = await Reimburse.find({ user_id: req.user_id });
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
    const existingReimburse = await Reimburse.findOne({ user_id: req.user_id });
    if (existingReimburse) {
      // Jika, add the new reimbursement to the existing user
      existingReimburse.reimbursements.push(req.body);
      await existingReimburse.save();
      res.status(201).json({
        message: "Pembuatan reimburse berhasil",
        data: existingReimburse,
      });
    } else {
      const newReimburse = await Reimburse.create(req.body);
      res
        .status(201)
        .json({ message: "Pembuatan reimburse berhasil", data: newReimburse });
    }
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};
