import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    
    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');
    console.log('Auth middleware - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        error: true,
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    
    const user = await UserModel.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid token.",
        error: true,
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Auth middleware - Error:', error.message);
    return res.status(401).json({
      message: "Invalid token.",
      error: true,
      success: false,
    });
  }
};