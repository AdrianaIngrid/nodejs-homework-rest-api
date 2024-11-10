const services = require("../services/index");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const fs = require("fs").promises;
const path = require("path");
const avatarsDir = path.join(__dirname, "../public/avatars");
require("dotenv").config();
const secret = process.env.SECRET;
const User = require("../services/schemas/userSchema");
const { checkUserDB } = require("../services/index");
const createUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await services.createUser({ email, password });
    const payload = { id: result._id, email: result.email };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    console.log("JWT Secret:", secret);
    console.log("Generated Token:", token);
    result.token = token;
    await result.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: { email: result.email, token },
    });
  } catch (error) {
    next(error);
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await checkUserDB({
      email,
      password,
    });

    const payload = { email: result.email };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.status(201).json({
      status: "succes",
      code: 201,
      data: {
        email: result.email,
        token,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      error: error.message,
    });
  }
};

const logoutController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
const currentUserController = (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};
const uploadAvatarController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(404).json({ error: "There is no file to upload" });
    }
    const { path: tmpPath, originalname } = req.file;
    const avatarName = `${req.user._id}-${
      Date.now() + path.extname(originalname)
    }`;
    const finalAvatarPath = path.join(avatarsDir, avatarName);
    const image = await Jimp.read(tmpPath);
    await image.resize(250, 250).writeAsync(finalAvatarPath);
    await fs.unlink(tmpPath);
    const avatarURL = `/public/avatars/${avatarName}`;
    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUserController,
  loginUserController,
  logoutController,
  currentUserController,
  uploadAvatarController,
};
