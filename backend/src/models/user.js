const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  "Users",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
        default: "male",
      },
      wasBorn: {
        type: Date,
        default: Date.now,
        required: true,
      },
      image: {
        type: String,
      },
      password: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);
