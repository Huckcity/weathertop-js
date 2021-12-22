const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: false,
  },
  lname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  broker: {
    url: {
      type: String,
      required: false,
    },
    port: {
      type: Number,
      required: false,
    },
    root: {
      type: String,
      required: false,
    },
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
