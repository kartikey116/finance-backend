import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Please provide the amount"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Record must be categorized as income or expense"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware to skip deleted records in queries gracefully
financeSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

// Middleware for aggregation to skip deleted records
financeSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Index for filtering & dashboard queries performance
financeSchema.index({ type: 1, category: 1, date: -1 });

export default mongoose.model("Finance", financeSchema);
