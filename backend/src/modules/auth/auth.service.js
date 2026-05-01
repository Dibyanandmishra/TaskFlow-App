const User = require("../user/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

// Register
const registerUser = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    user,
    token: generateToken(user),
  };
};

// Login
const loginUser = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    user,
    token: generateToken(user),
  };
};

module.exports = {
  registerUser,
  loginUser,
};