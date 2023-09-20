const mongoose = require("mongoose");

const leaveSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
    },
    leaves: [
      {
        index: {
          type: Number, // Add an index field to the reimbursement object
        },
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

// Middleware sebelum menyimpan (pre-save) ke dalam array, untuk mengatur indeks berdasarkan panjang array
leaveSchema.pre("save", function (next) {
  const leave = this.leaves[this.leaves.length - 1];
  if (leave) {
    leave.index = this.leaves.length;
  }
  next();
});

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
