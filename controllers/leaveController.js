const Leave = require("../models/leaveModel");

// ini fungsi untuk bisa melihat semua data user dan semua data leave user tersebut
exports.getAllUserLeave = async (req, res) => {
  try {
    const allLeaves = await Leave.find();
    if (allLeaves) {
      res.status(200).json({
        message: "Data semua user ditemukan.",
        data: allLeaves,
      });
    } else {
      res.status(400).json({ message: "Data leave belum ada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getApprovedLeave = async (req, res) => {
  let approvedLeaves;
  try {
    if (req.user.divisionId !== 2) {
      approvedLeaves = await Leave.find({
        division_id: req.user.divisionId,
        "leaves.hr_approval": true,
        "leaves.lead_approval": true,
      });
    } else {
      approvedLeaves = await Leave.find({
        "leaves.hr_approval": true,
        "leaves.lead_approval": true,
      });
    }

    if (approvedLeaves.length > 0) {
      res.status(200).json({
        message: "Data leave yang disetujui ditemukan.",
        data: approvedLeaves,
      });
    } else {
      res.status(400).json({ message: "Belum ada leave yang disetujui" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getPendingLeave = async (req, res) => {
  let pendingLeaves;
  try {
    if (req.user.divisionId !== 2) {
      pendingLeaves = await Leave.find({
        division_id: req.user.divisionId,
        $or: [
          { "leaves.hr_approval": false },
          { "leaves.lead_approval": false },
        ],
      });
    } else {
      pendingLeaves = await Leave.find({
        $or: [
          { "leaves.hr_approval": false },
          { "leaves.lead_approval": false },
        ],
      });
    }

    if (pendingLeaves.length > 0) {
      res.status(200).json({
        message: "Data leave yang belum disetujui ditemukan.",
        data: pendingLeaves,
      });
    } else {
      res.status(400).json({ message: "Semua leave belum disetujui" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getAllLeave = async (req, res) => {
  const leaves = await Leave.findOne({ user_id: req.user_id });
  try {
    if (!leaves || leaves.leaves.length === 0) {
      return res.status(404).json({
        message: "Data cuti masih kosong.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Data cuti ditemukan.",
      data: leaves.leaves,
    });
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
      const newLeave = await Leave.create({
        user_id: req.user_id,
        division_id: req.user.divisionId,
      });
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
    "start_date",
    "end_date",
    "policy_code",
    "notes",
    "file_name",
    "lead_approval",
    "hr_approval",
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
