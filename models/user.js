import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, min: 3 },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: { type: String, required: false },
    image: {
      type: String,
      required: true,
      default: "https://i.ibb.co/LNchwvr/5794329.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    contactNo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
