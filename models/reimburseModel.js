const mongoose = require("mongoose");

const reimburseSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    reimbursements: [
      {
        index: {
          type: Number, // Add an index field to the reimbursement object
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
reimburseSchema.pre("save", function (next) {
  const reimbursement = this.reimbursements[this.reimbursements.length - 1];
  if (reimbursement) {
    reimbursement.index = this.reimbursements.length;
  }
  next();
});

const Reimburse = mongoose.model("Reimburse", reimburseSchema);

module.exports = Reimburse;
