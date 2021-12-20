const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Device = mongoose.model("device", DeviceSchema);
