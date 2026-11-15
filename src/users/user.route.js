import express from "express";
import { Login, Signup, GetMe, Logout } from "./user.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/me", verifyToken, GetMe);
router.post("/logout", Logout)

export default router;