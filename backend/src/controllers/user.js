const UserService = require("../services/user");
const AuthService = require("../services/auth");
const bcrypt = require("bcrypt");

module.exports.getUsers = async (req, res) => {
  try {
    const currentAccountId = req?.user?.profile?._doc?._id || null;
    const users = await UserService.get(currentAccountId);

    return res.status(200).json({ status: 200, data: users });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const findUser = await UserService.find({ email });

    if (findUser) {
      throw Error("Пользователь с такой почтой уже существует");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hash,
    };

    await UserService.add(newUser);
    return res.status(200).json({ status: 200 });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    return res.status(200).json({
      status: 200,
      data: result.payload,
      token: result.jwt,
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

module.exports.logoutUser = (req, res) => {
  try {
    req.logout(req.user, () => {});

    return res.status(200).json({ status: 200 });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

module.exports.getAccount = (req, res) => {
  try {
    const account = req.user.profile._doc;
    return res.status(200).json({ status: 200, data: account });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

module.exports.updateAccount = async (req, res) => {
  try {
    const { name, email } = req.body;
    const account = req.user.profile._doc;

    await UserService.update(account._id, { name, email });

    const findUser = await UserService.find({ email });

    return res.status(200).json({ status: 200, data: findUser });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
