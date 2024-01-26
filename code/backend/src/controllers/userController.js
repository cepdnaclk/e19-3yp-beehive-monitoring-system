import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";

//@desc Register a user
//@route POST /api/users/register
//@access public

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are mandatory!" });
    throw new Error("All fields are mandatory!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400).json({ message: "User already exists" });
    throw new Error("User already registered!");
  }

  //Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Email is not valid" });
    throw new Error("Email is not valid");
  }

  //validate username
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username)) {
    res.status(400).json({ message: "Username is not valid" });
    throw new Error("Username is not valid");
  }

  //validate password
  //password should be at least 8 chars long
  //password should contain at least one number
  //password should contain at least one special char
  //password should contain at least one uppercase letter
  //password should contain at least one lowercase letter

  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ message: "Password is not valid" });
    throw new Error("Password is not valid");
  }

  //Hash password

  const hashedpassword = await bcrypt.hash(password, 10);
  console.log("Hashed password: ", hashedpassword);
  const user = await User.create({
    username,
    email,
    password: hashedpassword,
  });

  console.log(`User created ${user}`);
  if (user) {
    res
      .status(201)
      .json({ _id: user.id, email: user.email, username: user.username });
  } else {
    res.status(400).json({ message: "User data is not valid" });
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    throw new Error("User not found");
  }
  console.log(user);
  //compatre password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "100m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ message: "Incorrect password" });
    throw new Error("email or password is not valid");
  }
});

//@desc current user info
//@route POST /api/users/current
//@access private

export const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});
