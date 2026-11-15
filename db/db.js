import mongoose from "mongoose";

const connectDb = async (url) => {
  try {
    if (!url) {
      throw new Error("DB url missing");
    }

    await mongoose.connect(url);
    console.log("Database connection successful");
  } catch (error) {
    console.log("Database connection failed");
    throw error;
  }
};

export default connectDb;
