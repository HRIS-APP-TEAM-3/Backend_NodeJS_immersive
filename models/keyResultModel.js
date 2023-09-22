const mongoose = require("mongoose");

const keyResultSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    manager_id: {
      type: String,
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    progresses: [
      {
        employee_id: { type: String },
        name: { type: String },
        progress: { type: Number, min: 0, max: 100 },
        manager_approval: { type: Boolean, default: false },
        index: { type: Number },
        created_at: { type: String },
        updated_at: { type: String },
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
keyResultSchema.pre("save", function (next) {
  const progresses = this.progresses;
  const currentDate = new Date(); // Get the current date and time
  const newItemIndex = progresses.length - 1; // Index of the newly added item
  if (newItemIndex >= 0) {
    const newItem = progresses[newItemIndex];
    newItem.index = newItemIndex;
    newItem.start_date = formatDate(newItem.start_date); // Use formatDate function to set the date
    newItem.end_date = formatDate(newItem.end_date); // Use formatDate function to set the date
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

const KeyResult = mongoose.model("KeyResult", keyResultSchema);

module.exports = KeyResult;
