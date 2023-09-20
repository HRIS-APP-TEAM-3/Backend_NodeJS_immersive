const Leave = require("../models/leaveModel");

exports.getAllLeave = async (req, res) => {
  try {
    const leaves = await Leave.findOne({ user_id: req.user_id });
    if (leaves.leaves.length === 0) {
      res.status(200).json({
        message: "Data cuti masih kosong.",
        data: leaves.leaves,
      });
    }
    if (leaves) {
      res.status(200).json({
        message: "Data cuti ditemukan.",
        data: leaves.leaves,
      });
    } else {
      res.status(400).json({ message: "Data cuti belum ada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.addLeave = async (req, res) => {
  try {
    const existingLeave = await Leave.findOne({ user_id: req.user_id });
    if (existingLeave) {
      // Jika sudah pernah mebuat, maka akan menambahkan data cuti ke data user
      existingLeave.leaves.push(req.body);
      await existingLeave.save();
      res.status(201).json({
        message: "Penambahan cuti berhasil",
        data: existingLeave,
      });
    } else {
      const newLeave = await Leave.create({ user_id: req.user_id });
      newLeave.leaves.push(req.body);
      await newLeave.save();
      res
        .status(201)
        .json({ message: "Pembuatan cuti berhasil", data: newLeave });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getLeaveById = async (req, res) => {
  const { leaveIndex } = req.params;
  try {
    const leave = await Leave.findOne(
      {
        user_id: req.user_id,
        "leaves.index": parseInt(leaveIndex),
      },
      { "leaves.$": 1 }
    );
    if (!leave) {
      return res.status(404).json({ message: "Leave tidak ditemukan!" });
    }
    res.json({
      message: "Leave ditemukan!",
      data: leave.leaves,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateLeave = async (req, res) => {
  const { leaveIndex } = req.params;
  const updateFields = {};

  // Menentukan  array yang berisi field yang akan diperbarui.
  const allowedFields = [
    "benefit_name",
    "notes",
    "lead_approval",
    "hr_approval",
    "request_amount",
    "paid_amount",
    "file_name",
  ];

  // Melakukan perulangan elemen yang akan ditambahkan dan menambahkannya ke objek updateFields jika ada dalam request body.
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateFields[`leaves.$.${field}`] = req.body[field];
    }
  });

  try {
    const leave = await Leave.findOneAndUpdate(
      {
        user_id: req.user_id,
        "leaves.index": parseInt(leaveIndex),
      },
      { $set: updateFields },
      {
        new: true,
        projection: {
          leaves: { $elemMatch: { index: parseInt(leaveIndex) } },
        },
      }
    );

    console.log(leave);
    if (!leave) {
      return res.status(404).json({ message: "Leave tidak ditemukan!" });
    }

    res.status(200).json({
      message: "Leave berhasil diperbarui!",
      data: leave.leaves,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteLeave = async (req, res) => {
  const { leaveIndex } = req.params;
  try {
    const deleteLeave = await Leave.findOneAndUpdate(
      { user_id: req.user_id },
      {
        $pull: {
          leaves: { index: leaveIndex },
        },
      },
      { new: true }
    );

    if (!deleteLeave || deleteLeave.leaves.length === 0) {
      return res.status(404).json({ message: "Leave tidak ditemukan!" });
    }

    res.status(200).json({
      message: "Leave berhasil dihapus!",
      data: deleteLeave.leaves,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
