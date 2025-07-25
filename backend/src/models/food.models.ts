import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const food = new Schema(
  {
    foodName: { type: String, required: [true, "Please enter food name"] },
    price: { type: Number, required: [true, "Please enter price"] },
    image: String,
    ingredients: String,
    category: { type: Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

export const Food = model("Food", food);
