const UserModel = require("../models/user");

module.exports.get = async (currentId = null) => {
  try {
    if (currentId) {
      return await UserModel.find({ _id: { $ne: currentId } });
    }

    return await UserModel.find();
  } catch (e) {
    throw Error(e.message);
  }
};

module.exports.find = async (obj) => {
  try {
    const user = await UserModel.findOne(obj);
    return user;
  } catch (e) {
    throw Error(e.message);
  }
};

module.exports.add = async (json) => {
  try {
    return await UserModel.create(json);
  } catch (e) {
    throw Error(e.message);
  }
};

module.exports.update = async (id, obj) => {
  try {
    return await UserModel.findByIdAndUpdate(id, obj);
  } catch (e) {
    throw Error(e.message);
  }
};
