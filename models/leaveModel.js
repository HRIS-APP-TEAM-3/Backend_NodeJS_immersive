const mongoose = require("mongoose");

const leaveSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
    },
    leaves: [
      {
        start_date: {
          type: Date,
          required: true,
        },
        end_date: {
          type: Date,
          required: true,
        },
        policy_code: {
          type: String,
        },
        notes: {
          type: String,
          default: "Tanpa Keterangan",
        },
        file_name: {
          type: String,
        },
        lead_approval: {
          type: Boolean,
        },
        hr_approval: {
          type: Boolean,
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  }
);

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
