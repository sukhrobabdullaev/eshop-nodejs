const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper function for responses
const sendResponse = (res, statusCode, success, data = null, message = null) => {
  res.status(statusCode).json({ success, data, message });
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    if (!users || users.length === 0) {
      return sendResponse(res, 404, false, null, "No users found");
    }
    sendResponse(res, 200, true, users);
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
    });

    const createdUser = await newUser.save();
    sendResponse(res, 201, true, createdUser);
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return sendResponse(res, 404, false, null, "User not found");
    }
    sendResponse(res, 200, true, user);
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

const login = async (req, res) => {
  try {
    // Validate input fields
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, false, null, "Email and password are required");
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 400, false, null, "User not found");
    }

    // Validate password
    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      return sendResponse(res, 400, false, null, "Incorrect password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    sendResponse(res, 200, true, { email: user.email, name: user.name, token }, "User authenticated");
  } catch (err) {
    sendResponse(res, 500, false, null, "Internal server error");
  }
};

const register = async (req, res) => {
  try {
    // Validate input fields
    const { name, email, password, phone, isAdmin } = req.body;
    if (!name || !email || !password || !phone) {
      return sendResponse(res, 400, false, null, "Name, email, password, and phone are required");
    }

    if (password.length < 6) {
      return sendResponse(res, 400, false, null, "Password must be at least 6 characters long");
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, null, "Email is already registered");
    }

    // Create new user
    const newUser = new User({
      ...req.body,
      passwordHash: bcrypt.hashSync(password, 10),
    });

    const createdUser = await newUser.save();
    sendResponse(res, 201, true, createdUser, "User registered successfully");
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

// Get total user count
const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    sendResponse(res, 200, true, { count });
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return sendResponse(res, 404, false, null, "User not found");
    }
    sendResponse(res, 200, true, deletedUser, "User deleted successfully");
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  login,
  register,
  getUserCount,
  deleteUser,
};
