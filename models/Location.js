const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const DeviceSchema = require("./Device");

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  devices: {
    type: [DeviceSchema.schema],
    default: [],
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: ObjectId,
    required: true,
  },
});

module.exports = Location = mongoose.model("location", LocationSchema);
