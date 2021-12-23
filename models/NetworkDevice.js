const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mac_address: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
  last_seen: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = NetworkDevice = mongoose.model("networkdevice", DeviceSchema);
