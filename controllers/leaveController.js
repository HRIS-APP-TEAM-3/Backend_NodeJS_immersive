const Leave = require("../models/leaveModel");

exports.getAllLeave = async (req, res) => {
  try {
    const leave = await Leave.find({ user_id: req.user_id });
    if (leave.leaves.length > 0) {
      res.status(200).json({
        message: "Data cuti/izin ditemukan.",
        data: leave.leaves,
      });
    } else {
      res.status(400).json({ message: "Data cuti/izin belum ada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.addLeave = async (req, res) => {
  try {
    const existingLeave = await Leave.findOne({ user_id: req.user_id });
    if (existingLeave) {
      // Jika sudah pernah mebuat, maka akan menambahkan data cuti/izin ke data user
      existingLeave.leaves.push(req.body);
      await existingLeave.save();
      res.status(201).json({
        message: "Penambahan cuti/izin berhasil",
        data: existingLeave,
      });
    } else {
      const newLeave = await Leave.create({ user_id: req.user_id });
      newLeave.leaves.push(req.body);
      await newLeave.save();
      res
        .status(201)
        .json({ message: "Pembuatan cuti/izin berhasil", data: newLeave });
    }
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};
