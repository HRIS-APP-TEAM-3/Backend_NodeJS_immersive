const Reimburse = require("../models/reimburseModel");

exports.getAllReimburse = async (req, res) => {
  try {
    const reimburses = await Reimburse.findOne({ user_id: req.user_id });
    if (reimburses) {
      res.status(200).json({
        message: "Data reimburse ditemukan.",
        data: reimburses.reimbursements,
      });
    } else {
      res.status(400).json({ message: "Data reimburse belum ada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.addReimburse = async (req, res) => {
  console.log("tes");
  try {
    const existingReimburse = await Reimburse.findOne({ user_id: req.user_id });
    if (existingReimburse) {
      // Jika sudah pernah mebuat, maka akan menambahkan data reimburse ke data user
      existingReimburse.reimbursements.push(req.body);
      await existingReimburse.save();
      res.status(201).json({
        message: "Penambahan reimburse berhasil",
        data: existingReimburse,
      });
    } else {
      const newReimburse = await Reimburse.create({ user_id: req.user_id });
      newReimburse.reimbursements.push(req.body);
      await newReimburse.save();
      res
        .status(201)
        .json({ message: "Pembuatan reimburse berhasil", data: newReimburse });
    }
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};
