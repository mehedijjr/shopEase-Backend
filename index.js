import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import userRouter from "./src/users/user.route.js";
import productRouter from "./src/products/product.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const port = process.env.PORT || 5050;
const dbUrl = process.env.MONGODB_URL;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
    credentials: true,
  }),
);

app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Hello World");
});

// all routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

const startServer = async () => {
  try {
    await connectDb(dbUrl);

    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`Server running at: http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

startServer();

export default app;
