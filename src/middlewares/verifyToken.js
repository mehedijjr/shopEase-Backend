import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRAT_TOKEN;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRAT is missing");
    }

    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token not found! or Invalid token!",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;
    req.role = decoded.role;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token!",
    });
  }
};

export default verifyToken;