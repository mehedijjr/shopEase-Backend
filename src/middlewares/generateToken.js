import User from "../users/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
  const JWT_SECRAT = process.env.JWT_SECRAT_TOKEN;

  if (!JWT_SECRAT) {
    throw new Error("JWT_SECRAT is missing");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found!");
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRAT,
    { expiresIn: "1h" },
  );

  return token;
};

export default generateToken;
