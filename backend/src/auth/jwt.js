const passport = require("passport");
const Users = require("../models/users");
const Profiles = require("../models/profiles");
// const cookiestore = require("../cookies");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "asf4ASGiuh8xc735unjk",
};

module.exports = (app) => {
  app.post("/api/profile/login", async function (req, res) {
    if (!req.body.login && !req.body.password) return;

    let login = req.body.login;
    let password = req.body.password;

    const profile = await Profiles.findOne({
      where: { login: login, password: password },
      attributes: ["login", "profileId", "gameProfileId"],
    }).then((user) => {
      return user;
    });

    if (!profile) {
      res.status(401).json({ message: "Данные не верны" });
      return;
    }

    let userData = [];
    if (profile.gameProfileId) {
      userData = await Users.findOne({
        where: { users_id: profile.gameProfileId },
      }).then((data) => {
        return data;
      });
    }

    let payload = { profileId: profile.profileId };
    let token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.status(200).json({
      message: "ok",
      jwt: token,
      profile: profile,
      user: userData,
    });
  }),
    app.post("/api/profile/register", async function (req, res) {
      if (!req.body.login && !req.body.password && !req.body.email) return;

      const login = req.body.login;
      const password = req.body.password;
      const email = req.body.email;

      const user = await Profiles.findOne({
        where: { login: login },
      }).then((user) => {
        return user;
      });

      if (user) {
        res.status(401).json({ message: "Такой пользователь уже существует" });
        return;
      }

      await Profiles.create({ login, password, email });

      const profile = await Profiles.findOne({
        where: { login: login },
        attributes: ["login", "profileId"],
      }).then((user) => {
        return user;
      });

      let payload = { profileId: profile.profileId };
      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      res
        .status(200)
        .json({ message: "ok", jwt: token, profile: [profile], user: [] });
    }),
    app.get("/api/profile/logout", (req, res) => {
      req.logout();
    }),
    app.get(
      "/api/profile/get",
      passport.authenticate("jwt", { session: false }),
      function (req, res) {
        res.status(200).json({
          message: "oks",
          profile: req.user.profile,
          user: req.user.user,
        });
      }
    );
};

passport.use(
  new JwtStrategy(jwtOptions, async function (jwt_payload, next) {
    if (!jwt_payload.profileId) {
      next(null, false);
      return;
    }
    await Profiles.findOne({
      where: { profileId: jwt_payload.profileId },
      attributes: ["login", "profileId", "gameProfileId"],
    }).then((profile) => {
      if (profile) {
        if (profile.gameProfileId) {
          Users.findOne({ where: { users_id: profile.gameProfileId } }).then(
            (user) => {
              next(null, {
                profile: profile.dataValues,
                user: user.dataValues,
              });
            }
          );
        } else {
          next(null, { profile: profile.dataValues, user: [] });
        }
      } else {
        next(null, false);
      }
    });
  })
);
