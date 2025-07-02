import express from "express";
import {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import verifyToken from "../middleware/auth.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.post("/", createCategory);
categoryRouter.patch("/:foodCategoryId", verifyToken, updateCategory);
categoryRouter.delete("/:foodCategoryId", verifyToken, deleteCategory);

export default categoryRouter;
