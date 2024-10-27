const services = require("../services/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const User = require('../services/schemas/userSchema');
const createUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
      const result = await services.createUser({ email, password });
      const payload = { email: result.email };
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

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
           return res
             .status(401)
             .json({ message: "Email or password is wrong" });
        }
        const isPasswordValid = await user.isPasswordValid(password);
        if (!isPasswordValid) {
            return res
              .status(401)
              .json({ message: "Email or password is wrong" });
        }

        const payload = { email: user.email, id: user._id };
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });
        user.token = token;
        await user.save();
        res.status(200).json({
            token, user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
        
    } catch (error) {
        next(error);
    }
};
module.exports = {
  createUserController,
  loginController,
};
