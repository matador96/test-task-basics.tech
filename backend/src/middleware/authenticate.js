const passport = require("passport");
const UserService = require("./../services/user");

const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "asf4ASGiuh8xc735unjk",
};

const checkPassportAuthenticate = (req, res, next, skipReturn = false) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!skipReturn) {
      if (err) {
        res.status(err.statusCode || 401).json({ error: err.toString() });
        return;
      }

      if (!user) {
        res.status(401).json({});
        return;
      }
    }

    req.user = user;

    next();
  })(req, res, next);
};

module.exports = {
  authenticate: (req, res, next) => checkPassportAuthenticate(req, res, next),
  authenticateWithoutReturn: (req, res, next) =>
    checkPassportAuthenticate(req, res, next, true),
  jwtOptions,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    const profile = await UserService.find({
      _id: jwt_payload.id,
    });

    if (profile) {
      delete profile.password;
      next(null, {
        profile: { ...profile },
      });
    } else {
      next(null, false);
    }
  })
);
