const mongoose = require("mongoose");
const Schemal = mongoose.Schema;
const reviewSchema = mongoose.Schema(
  {
    name: { type: String },
    rating: { type: String },
    comment: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const otherDescription = mongoose.Schema({
  name1: {
    type: String,
    trim: true,
  },
  number: {
    type: String,
    trim: true,
  }
})

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    otherDescription: [mongoose.Schema.Types.Mixed],
    offer: { type: Number },
    productPictures: [{ img: { type: String } }],
    reviews: [reviewSchema],
    rating: {
      type: String,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
