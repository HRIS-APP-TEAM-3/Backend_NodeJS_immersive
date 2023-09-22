const Reimburse = require("../models/reimburseModel");

// ini fungsi untuk bisa melihat semua data user dan semua data reimburse user tersebut
exports.getAllUserReimburse = async (req, res) => {
  try {
    const allReimburses = await Reimburse.find();
    if (allReimburses) {
      res.status(200).json({
        message: "Data semua user ditemukan.",
        data: allReimburses,
      });
    } else {
      res.status(400).json({ message: "Data reimburse belum ada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getApprovedReimburse = async (req, res) => {
  let approvedReimburses;
  try {
    if (req.user.divisionId !== 2) {
      approvedReimburses = await Reimburse.find({
        division_id: req.user.divisionId,
        "reimbursements.hr_approval": true,
        "reimbursements.lead_approval": true,
      });
    } else {
      approvedReimburses = await Reimburse.find({
        "reimbursements.hr_approval": true,
        "reimbursements.lead_approval": true,
      });
    }

    if (approvedReimburses.length > 0) {
      res.status(200).json({
        message: "Data reimburse yang disetujui ditemukan.",
        data: approvedReimburses,
      });
    } else {
      res.status(400).json({ message: "Belum ada reimburse yang disetujui" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getPendingReimburse = async (req, res) => {
  let pendingReimburses;
  try {
    if (req.user.divisionId !== 2) {
      pendingReimburses = await Reimburse.find({
        division_id: req.user.divisionId,
        $or: [
          { "reimbursements.hr_approval": false },
          { "reimbursements.lead_approval": false },
        ],
      });
    } else {
      pendingReimburses = await Reimburse.find({
        $or: [
          { "reimbursements.hr_approval": false },
          { "reimbursements.lead_approval": false },
        ],
      });
    }

    if (pendingReimburses.length > 0) {
      res.status(200).json({
        message: "Data reimburse yang belum disetujui ditemukan.",
        data: pendingReimburses,
      });
    } else {
      res.status(400).json({ message: "Semua reimburse belum disetujui" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

// fungsi ini hanya melihat semua reimburse dari user yang sedang login
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
  try {
    const existingReimburse = await Reimburse.findOne({ user_id: req.user_id });
    if (existingReimburse) {
      // Jika sudah pernah membuat, maka akan menambahkan data reimburse ke data user
      const newReimburseData = { ...req.body, file_name: req.file.filename }; // Add the file_name property
      existingReimburse.reimbursements.push(newReimburseData);
      await existingReimburse.save();
      res.status(201).json({
        message: "Penambahan reimburse berhasil",
        data: existingReimburse,
      });
    } else {
      const newReimburseData = {
        user_id: req.user_id,
        division_id: req.user.divisionId,
        reimbursements: [{ ...req.body, file_name: req.file.filename }], // Add the file_name property
      };
      const newReimburse = await Reimburse.create(newReimburseData);
      res.status(201).json({
        message: "Pembuatan reimburse berhasil",
        data: newReimburse,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getReimburseById = async (req, res) => {
  const { reimburseIndex } = req.params;
  try {
    const reimburse = await Reimburse.findOne(
      {
        user_id: req.user_id,
        "reimbursements.index": parseInt(reimburseIndex),
      },
      { "reimbursements.$": 1 }
    );
    if (!reimburse) {
      return res.status(404).json({ message: "Reimburse tidak ditemukan!" });
    }
    res.json({
      message: "Reimburse ditemukan!",
      data: reimburse.reimbursements,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateReimburse = async (req, res) => {
  const { reimburseIndex } = req.params;

  // Menentukan  array yang berisi field yang akan diperbarui.
  const allowedFields = [
    "reimburse_name",
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
      updateFields[`reimbursements.$.${field}`] = req.body[field];
    }
  });

  // Update the updated_at field in the main document
  updateFields["updated_at"] = Date.now();

  try {
    const reimburse = await Reimburse.findOneAndUpdate(
      {
        user_id: req.user_id,
        "reimbursements.index": parseInt(reimburseIndex),
      },
      { $set: updateFields },
      {
        new: true,
        projection: {
          reimbursements: { $elemMatch: { index: parseInt(reimburseIndex) } },
        },
      }
    );

    if (!reimburse) {
      return res.status(404).json({ message: "Reimburse tidak ditemukan!" });
    }

    // Extract and return only the updated reimbursement data
    const updatedReimbursement = reimburse.reimbursements[0];

    res.status(200).json({
      message: "Reimburse berhasil diperbarui!",
      data: updatedReimbursement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteReimburse = async (req, res) => {
  const { reimburseIndex } = req.params;
  try {
    const deleteReimburse = await Reimburse.findOneAndUpdate(
      { user_id: req.user_id },
      {
        $pull: {
          reimbursements: { index: reimburseIndex },
        },
      },
      { new: true }
    );

    if (!deleteReimburse || deleteReimburse.reimbursements.length === 0) {
      return res.status(404).json({ message: "Reimburse tidak ditemukan!" });
    }

    res.status(200).json({
      message: "Reimburse berhasil dihapus!",
      data: deleteReimburse.reimbursements,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
