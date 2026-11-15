import mongoose from "mongoose";
import Product from "./product.model.js";

export const addProduct = async (req, res) => {
  try {
    const { name, category, description, price, image, stock } = req.body;

    const author = req.userId;

    if (
      !name ||
      !category ||
      !description ||
      price === undefined ||
      Number(price) <= 0 ||
      !image ||
      stock === undefined ||
      Number(stock) < 0 ||
      !author
    ) {
      return res.status(400).json({
        message: "All fields are required or Unauthorized",
      });
    }

    const product = await Product.create({
      name,
      category,
      description,
      price: Number(price),
      image,
      stock: Number(stock),
      author: new mongoose.Types.ObjectId(author),
    });

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log("addProduct error: ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find({})
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log("Error to get all Products: ", error);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("author", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log("Error to fetch single product by id: ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format!",
      });
    }

    const { name, category, description, price, image, stock } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (image !== undefined) updateData.image = image;
    if (stock !== undefined) updateData.stock = Number(stock);

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate("author", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product by id: ", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format!",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product by id: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

