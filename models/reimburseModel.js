const mongoose = require("mongoose");

const reimburseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      unique: true,
    },
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    benefit_name: {
      type: String,
    },
    notes: {
      type: String,
      default: "Tidak ada keterangan",
    },
    lead_approval: {
      type: Boolean,
    },
    hr_approval: {
      type: Boolean,
    },
    request_amount: {
      type: Number,
      min: 0,
      required: true,
      set: (value) => parseFloat(value).toFixed(2),
    },
    paid_amount: {
      type: Number,
      min: 0,
      required: true,
      set: (value) => parseFloat(value).toFixed(2),
    },
    file_name: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  }
);

const Reimburse = mongoose.model("Reimburse", reimburseSchema);

module.exports = Reimburse;
