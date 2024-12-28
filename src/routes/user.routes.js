const express = require("express");
const {
  getUsers,
  createUser,
  getUserById,
  login,
  register
} = require("../controllers/user.controller");

const router = express.Router();

// Routes
router.get("/", getUsers);
router.post("/create", createUser);
router.get("/:id", getUserById);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
