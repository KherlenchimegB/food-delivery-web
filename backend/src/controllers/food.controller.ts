import { Request, Response } from "express";
import { Food, Category } from "../models/index.js";

export const getAllFoods = async (request: Request, response: Response) => {
  try {
    const foods = await Food.find().populate("category");
    response.json({ success: true, data: foods });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const getFoodByid = async (request: Request, response: Response) => {
  try {
    const { foodId } = request.params;
    const foodsById = await Food.findById(foodId).populate("category");
    response.json({ success: true, data: foodsById });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const createFood = async (request: Request, response: Response) => {
  try {
    const { foodName, price, image, ingredients, categoryName } = request.body;

    // CategoryName-ээс category ID олох
    let categoryId = null;
    if (categoryName && categoryName !== "Other Foods") {
      const category = await Category.findOne({ categoryName: categoryName });
      if (category) {
        categoryId = category._id;
      }
    }

    const createdFood = await Food.create({
      foodName: foodName,
      price: price,
      image: image,
      ingredients: ingredients,
      category: categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Populate category-тай хамт буцаах
    const populatedFood = await Food.findById(createdFood._id).populate(
      "category"
    );
    response.json({ success: true, data: populatedFood });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const updateFood = async (request: Request, response: Response) => {
  try {
    const { foodName, price, image, ingredients, categoryName } = request.body;
    const { foodId } = request.params;

    // CategoryName-ээс category ID олох
    let categoryId = null;
    if (categoryName && categoryName !== "Other Foods") {
      const category = await Category.findOne({ categoryName: categoryName });
      if (category) {
        categoryId = category._id;
      }
    }

    const updatedFoodData = {
      foodName,
      price,
      image,
      ingredients,
      category: categoryId,
      updatedAt: new Date(),
    };

    const food = await Food.findByIdAndUpdate(foodId, updatedFoodData, {
      new: true,
    }).populate("category");

    response.json({ success: true, data: food });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const deleteFood = async (request: Request, response: Response) => {
  try {
    const deletedFood = request.body;
    const { foodId } = request.params;
    const food = await Food.findByIdAndDelete(foodId, deletedFood);

    response.json({ success: true, data: food });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};
