const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const User = require("../services/schemas/userSchema");
require("dotenv").config();
const secret = process.env.SECRET;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);
