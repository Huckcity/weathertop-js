const mongoose = require('mongoose')

const ReadingSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  windSpeed: {
    type: Number,
    required: true,
  },
  pressure: {
    type: Number,
    required: true,
  },
  windDirection: {
    type: Number,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Reading = mongoose.model('reading', ReadingSchema)
