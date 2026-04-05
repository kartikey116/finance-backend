import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide the amount"],
    },
    type: {
      type: String,
      lowercase: true,
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

financeSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

financeSchema.index({ type: 1, category: 1, date: -1 });

export default mongoose.model("Finance", financeSchema);