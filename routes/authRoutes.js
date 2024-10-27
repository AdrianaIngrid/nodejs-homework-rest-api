const express = require("express");
const router = express.Router();
const {
  createUserController,
  loginController,
    logoutController,
  currentUserController,
} = require("../controllers/authController");
const validateSignUp = require("../middlewares/validateSignUp");
const loginValidate = require("../middlewares/validateLogin");
const { auth } = require("../middlewares/auth");



router.post("/signup", validateSignUp, createUserController);
router.post("/login", loginValidate, loginController);
router.get("/logout", auth, logoutController);
router.get("/current", auth, currentUserController);
module.exports = router;

