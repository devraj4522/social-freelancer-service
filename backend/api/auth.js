const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");
const authMiddleware = require("../middleware/authMiddleware");
const ProfileModel = require("../models/ProfileModel");

router.get("/", authMiddleware, async (req, res) => {
  let userId = "";
  if (req.query.userId) {
    userId = req.query.userId;
  }
  else
    userId = req.userId;
  let { getFollowingData } = req.query;
  getFollowingData = getFollowingData ? JSON.parse(getFollowingData) : false;

  try {
    let user = await UserModel.findById(userId);
    const profile = await ProfileModel.findOne({ user: userId }).populate("user");
    user = {
      ...user._doc,
      bio: profile._doc.bio,
      social: profile._doc.social,
      isSeller: profile._doc.isSeller,
      country: profile._doc.country,
    };

    if (!user) {
      return res.status(404).send("User not found");
    }

    let userFollowStats;

    if (getFollowingData) {
      userFollowStats = await FollowerModel.findOne({ user: userId }).select(
        "-followers"
      );
    }

    return res.status(200).json({ user, userFollowStats });
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

router.post("/", async (req, res) => {
  const { email, password } = req.body.user;

  if (!isEmail(email)) return res.status(401).send("Invalid Email");

  if (password.length < 6) {
    return res.status(401).send("Password must be atleast 6 characters");
  }

  try {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).send("Invalid Credentials");
    }
    const profile = await ProfileModel.findOne({ user: user._id }).populate("user");

    const payload = { userId: user._id, isSeller: profile.isSeller };
    jwt.sign(payload, process.env.jwtSecret, { expiresIn: "2d" }, (err, token) => {
      if (err) throw err;
      res.json(token);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});


module.exports = router;