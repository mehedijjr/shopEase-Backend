import bcrypt from "bcrypt";
import User from "./user.model.js";
import generateToken from "../middlewares/generateToken.js";

export const Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validate all fields
    if (!username?.trim().toLowerCase() || !email || !password) {
      return res.status(400).json({
        message: "All field are required",
      });
    }

    // validate existing user
    const existingUser = await User.findOne({
      email: email?.trim()?.toLowerCase(),
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User is already in exist",
        success: false,
      });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashPassword,
    });

    // success response
    return res.status(201).json({
      message: "User created successful",
      success: true,
      user: {
        userId: user._id,
        userName: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Signup error: ", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }
    return res.status(500).json({
      message: "Inter server error",
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate all fields
    if (!email?.trim().toLowerCase() || !password) {
      return res.status(400).json({
        message: "Email and Password field are required",
      });
    }

    // validate existing user
    const user = await User.findOne({
      email: email?.trim()?.toLowerCase(),
    }).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // hash password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({
        message: "Invalid Password",
        success: false,
      });
    }

    // jwt token use
    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    // success response
    return res.status(200).json({
      message: "User Login successful",
      success: true,
      user: {
        userId: user._id,
        userName: user.username,
        email: user.email,
        role: user.role,
        token: token,
      },
    });
    console.log("Login Successful");
  } catch (error) {
    console.log("Login error: ", error);

    return res.status(500).json({
      message: "Inter server error",
      success: false,
    });
  }
};

export const GetMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        userId: user._id,
        userName: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Logout error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
