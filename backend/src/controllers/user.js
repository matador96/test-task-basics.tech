const UserService = require("../services/user");
const AuthService = require("../services/auth");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const getPasswordHash = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);

  return hash;
};

const deleteFile = (imagePath) => {
  if (!imagePath) {
    return;
  }
  const fs = require("fs");
  const filePath = path.join(__dirname, "../../" + imagePath);

  fs.unlinkSync(filePath);
};

const downloadFile = (sendedFile) => {
  const newpath = path.join(__dirname, "../../downloads/");

  const file = sendedFile;
  const filename = file.name;

  const generatedName = uuidv4() + filename;

  let isHaveSomeErrors = false;
  file.mv(`${newpath}${generatedName}`, (err) => {
    if (err) {
      isHaveSomeErrors = true;
    }
  });

  return isHaveSomeErrors ? false : `/downloads/${generatedName}`;
};

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
    const { name, email, password, gender, wasBorn } = req.body;

    const findUser = await UserService.find({ email });

    if (findUser) {
      throw Error("User exist with this email");
    }

    const userImage = downloadFile(req.files.file);

    if (!userImage) {
      throw Error("Error on image download");
    }

    const passwordHash = await getPasswordHash(password);
    const newUser = {
      name,
      email,
      password: passwordHash,
      gender,
      wasBorn,
      image: userImage,
    };

    await UserService.add(newUser);

    const result = await AuthService.login(newUser.email, password);

    return res.status(200).json({
      status: 200,
      data: result.payload,
      token: result.jwt,
    });
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
    const { name, password } = req.body;
    const account = req.user.profile._doc;

    let updatedFields = {};

    if (req?.files?.file) {
      deleteFile(account?.image);
      updatedFields.image = downloadFile(req.files.file);
    }

    if (password) {
      updatedFields.password = await getPasswordHash(password);
    }

    if (name) {
      updatedFields.name = name;
    }

    await UserService.update(account._id, updatedFields);

    const findUser = await UserService.find({ _id: account._id });

    return res.status(200).json({ status: 200, data: findUser });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
