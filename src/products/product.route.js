import express from "express";
import {
  addProduct,
  deleteProductById,
  editProductById,
  getAllProducts,
  getProductById,
} from "./product.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post("/add-product", verifyToken, verifyAdmin, addProduct);

router.put("/edit-product/:id", verifyToken, verifyAdmin, editProductById);

router.delete("/:id", verifyToken, verifyAdmin, deleteProductById)

export default router;
