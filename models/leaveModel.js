const mongoose = require("mongoose");

const leaveSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
    },
    division_id: {
      type: Number,
    },
    leaves: [
      {
        index: {
          type: Number, // Add an index field to the leave object
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
        created_at: {
          type: Date, // Add created_at field to track creation time
          default: Date.now,
        },
        updated_at: {
          type: Date, // Add updated_at field to track update time
          default: Date.now,
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
  const leaves = this.leaves;
  leaves.forEach((leave, index) => {
    leave.index = index;
  });
  next();
});

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
