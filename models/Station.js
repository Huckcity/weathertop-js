const mongoose = require('mongoose')

const StationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Station = mongoose.model('station', StationSchema)
