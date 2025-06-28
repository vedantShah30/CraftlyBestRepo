import User from "../models/users.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const Login = async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    const { name, email, phoneNumber, avatar } = req.body;

    let user = await User.findOne({ email });
    console.log(user ? "User found:" : "User not found, creating new user");

    if (!user) {
      const newUser = new User({
        name,
        email,
        phoneNumber,
        avatar,
      });
      user = await newUser.save();
      console.log("New user created:", user);
    } else {
      console.log("Existing user retrieved:", user);
    }

    // Convert to plain object and generate token
    const userObj = user.toObject({ getters: true });
    console.log("User object for JWT payload:", userObj);

    const token = jwt.sign(userObj, process.env.JWT_SECRET);
    console.log("JWT token generated:", token);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,       // Ensure HTTPS (Render provides HTTPS)
      sameSite: "none",   // Required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    console.log("Cookie set in response");

    res.status(200).json({
      success: true,
      message: "User login successfully.",
      user: userObj,
    });
  } catch (error) {
    console.error("Error in Login:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    console.log("Cookies received on getUser:", req.cookies);

    const token = req.cookies.access_token;
    if (!token) {
      console.log("No access_token cookie found");
      return res.status(403).json({
        success: false,
        message: "Authentication token not found.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully:", decoded);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return res.status(403).json({
        success: false,
        message: "Invalid token.",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    console.log("User found:", user);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Server error in getUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

export const deleteCode = async (req, res) => {
  try {
    const { id } = req.body;
    const { userid } = req.params;
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const objectIdToDelete = new mongoose.Types.ObjectId(id);
    user.prompts = user.prompts.filter(
      (prompt) => !prompt._id.equals(objectIdToDelete)
    );
    await user.save();
    res.status(200).json({
      success: true,
      message: "Code deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting code:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};
