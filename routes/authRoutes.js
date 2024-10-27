const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const validateSignUp = require("../middlewares/validateSignUp");
const loginValidate = require("../middlewares/validateLogin");



router.post("/signup", validateSignUp, controller.createUserController);
router.post("/login", loginValidate, controller.loginController );
module.exports = router;
