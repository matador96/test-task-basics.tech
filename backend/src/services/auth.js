const jwt = require("jsonwebtoken");
const ExtractJwt = require("passport-jwt").ExtractJwt;

const bcrypt = require("bcrypt");

const UserService = require("./user");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "asf4ASGiuh8xc735unjk",
};

module.exports.login = async (email, password) => {
  try {
    const findedUser = await UserService.find({ email });
    if (!findedUser) {
      throw Error("Данные не верны");
    }

    const matched = await bcrypt.compare(password, findedUser.password);
    if (!matched) {
      throw Error("Пароль не верен");
    }

    const { id, name, image, wasBorn, gender } = findedUser;
    let payload = { id, name, email, image, wasBorn, gender };
    let token = jwt.sign(payload, jwtOptions.secretOrKey);

    return { jwt: token, payload };
  } catch (e) {
    throw Error(e.message);
  }
};
