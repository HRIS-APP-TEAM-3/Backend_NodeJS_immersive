const Key = require("../models/keyResultModel");

// ini fungsi untuk bisa melihat semua data user dan semua data keyResult user tersebut
exports.getAllUserKey = async (req, res) => {
  try {
    const allKeys = await Key.find();
    if (allKeys.length > 0) {
      // Check if any keys are found
      res.status(200).json({
        message: "Data semua user ditemukan.",
        data: allKeys,
      });
    } else {
      res.status(404).json({ message: "Data keyResult belum ada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getAchievedKey = async (req, res) => {
  try {
    let achievedKeys;
    if (req.user.divisionId === 3) {
      achievedKeys = await Key.find({
        manager_id: req.user.user_id,
        "progresses.manager_approval": true,
      });
    } else {
      achievedKeys = await Key.find({
        "progresses.manager_approval": true,
      });
    }

    if (achievedKeys.length > 0) {
      res.status(200).json({
        message: "Data keyResult yang disetujui ditemukan.",
        data: achievedKeys,
      });
    } else {
      res.status(404).json({ message: "Belum ada keyResult yang disetujui" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getPendingKey = async (req, res) => {
  try {
    let ongoingKeys;
    if (req.user.divisionId !== 2) {
      ongoingKeys = await Key.find({
        manager_id: req.user.divisionId,
        "progresses.manager_approval": false,
      });
    } else {
      ongoingKeys = await Key.find({
        "progresses.manager_approval": false,
      });
    }

    if (ongoingKeys.length > 0) {
      res.status(200).json({
        message: "Data keyResult yang belum disetujui ditemukan.",
        data: ongoingKeys,
      });
    } else {
      res.status(404).json({ message: "Semua keyResult belum disetujui" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getAllKey = async (req, res) => {
  try {
    const keyResults = await Key.findOne({ manager_id: req.user_id });
    if (!keyResults || keyResults.progresses.length === 0) {
      return res.status(404).json({
        message: "Data Key Result masih kosong.",
        data: [],
      });
    }
    res.status(200).json({
      message: "Data Key Result ditemukan.",
      data: keyResults.progresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.addKey = async (req, res) => {
  try {
    const existingKey = await Key.findOne({ manager_id: req.user_id });
    if (existingKey) {
      // Jika sudah pernah membuat, maka akan menambahkan data Key Result ke data user
      existingKey.progresses.push(req.body);
      await existingKey.save();
      res.status(201).json({
        message: "Penambahan Key Result berhasil",
        data: existingKey,
      });
    } else {
      const newKey = await Key.create({
        manager_id: req.user.user_id,
        progresses: [req.body], // Create a new array with the initial Key Result
      });
      res.status(201).json({
        message: "Pembuatan Key Result berhasil",
        data: newKey,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ada error saat melakukan proses" });
  }
};

exports.getKeyById = async (req, res) => {
  const { keyResultIndex } = req.params;
  try {
    const keyResult = await Key.findOne(
      {
        manager_id: req.user_id,
        "progresses.employee_id": parseInt(keyResultIndex),
      },
      { "progresses.$": 1 }
    );
    if (!keyResult) {
      return res.status(404).json({ message: "Progress tidak ditemukan!" });
    }
    res.json({
      message: "Progress ditemukan!",
      data: keyResult.progresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateKey = async (req, res) => {
  const { keyResultIndex } = req.params;
  const updateFields = {};

  // Menentukan array yang berisi field yang akan diperbarui.
  const allowedFields = ["employee_id", "name", "progress", "manager_approval"];

  // Melakukan perulangan elemen yang akan ditambahkan dan menambahkannya ke objek updateFields jika ada dalam request body.
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateFields[`progresses.$.${field}`] = req.body[field];
    }
  });

  try {
    const keyResult = await Key.findOneAndUpdate(
      {
        manager_id: req.user_id,
        "progresses.employee_id": parseInt(keyResultIndex),
      },
      { $set: updateFields },
      {
        new: true,
        projection: {
          keyResults: { $elemMatch: { progresses: parseInt(keyResultIndex) } },
        },
      }
    );

    if (!keyResult) {
      return res.status(404).json({ message: "Key tidak ditemukan!" });
    }

    res.status(200).json({
      message: "Key berhasil diperbarui!",
      data: keyResult.progresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteKey = async (req, res) => {
  const { keyResultIndex } = req.params;
  try {
    const deleteKey = await Key.findOneAndUpdate(
      { manager_id: req.user_id },
      {
        $pull: {
          progresses: { employee_id: keyResultIndex },
        },
      },
      { new: true }
    );

    if (!deleteKey || deleteKey.progresses.length === 0) {
      return res.status(404).json({ message: "Key tidak ditemukan!" });
    }

    res.status(200).json({
      message: "Key berhasil dihapus!",
      data: deleteKey.progresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
