const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const userList = await User.find().select("-passwordHash");
    if (!userList) {
      res.status(404).json({ message: "Users Not Found", success: false });
    }
    res.status(200).json(userList);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const createUser = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  try {
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-passwordHash");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("The user not found");
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).send({
        message: "User Authenticated",
        user: { email: user.email, name: user.name, token: token }, // Customize user object as needed
      });
    } else {
      res.status(400).send("Password is wrong!");
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

const register = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  try {
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (err) { 
    res.status(500).json({ error: err.message, success: false });
  }
};


module.exports = { getUsers, createUser, getUserById, login, register }