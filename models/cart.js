import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        qty: {
          type: Number,
          default: 0,
        },
      },
    ],
    user_email: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timeStamps: true }
);

// module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);