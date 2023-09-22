const mongoose = require("mongoose");

const reimburseSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    division_id: {
      type: Number,
    },
    reimbursements: [
      {
        index: {
          type: Number, // Add an index field to the reimbursement object
        },
        reimburse_name: {
          type: String,
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
        created_at: {
          type: String, // Add created_at field to track creation time
          default: Date.now,
        },
        updated_at: {
          type: String, // Add updated_at field to track update time
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
reimburseSchema.pre("save", function (next) {
  const reimbursements = this.reimbursements;
  const currentDate = new Date(); // Get the current date and time
  const newItemIndex = reimbursements.length - 1; // Index of the newly added item
  if (newItemIndex >= 0) {
    const newItem = reimbursements[newItemIndex];
    newItem.index = newItemIndex;
    newItem.created_at = formatDate(newItem.created_at); // Use formatDate function to set the date
    newItem.updated_at = formatDate(currentDate); // Use formatDate function to set the date to the current date
  }
  next();
});

// Format date to "YYYY-MM-DD"
function formatDate(date) {
  if (!date) return ""; // Handle cases where date is not provided
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const Reimburse = mongoose.model("Reimburse", reimburseSchema);

module.exports = Reimburse;
