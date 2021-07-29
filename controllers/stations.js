const fetch = require('node-fetch')
const Station = require('../models/Station')
const Reading = require('../models/Reading')

const stations = {
  async findOne(req, res) {
    Station.findById(req.params.id)
      .lean()
      .then(station => {
        console.log(station.readings)
        res.render('station', station)
      })
      .catch(err =>
        res.status(404).json({
          noStations: 'No station found for id: ' + req.params.id,
        })
      )
  },
  async addStation(req, res) {
    Station.create(req.body)
      .then(station => {
        console.log({ msg: 'Station added successfully:' + station })
        res.redirect('/')
      })
      .catch(err => {
        console.log(err.message)
        res.status(400).json({ error: 'Unable to add this station' })
      })
  },
  async updateStation(req, res) {
    await Station.findByIdAndUpdate(req.params.id, req.body)
      .then(station => res.json({ msg: 'Updated successfully' }))
      .catch(err =>
        res.status(400).json({
          error: 'Unable to update the station ' + req.params.id,
        })
      )
  },
  async deleteStation(req, res) {
    await Station.findByIdAndDelete(req.params.id)
      .then(data => console.log(`${data} was deleted`))
      .then(() => res.redirect('/'))
      .catch(err => {
        res.status(400).json({
          error: 'Unable to delete station',
        })
      })
  },
  async addReading(req, res) {
    const reading = new Reading(req.body)
    Station.findByIdAndUpdate(req.params.id, { $push: { readings: reading } })
      .then(() => {
        res.redirect('/stations/' + req.params.id)
      })
      .catch(err => {
        console.log(err)
      })
  },
  async addAPIReading(req, res) {
    const station = await Station.findById(req.params.id)
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${station.lat}&lon=${station.lng}&appid=${process.env.OPENWEATHERAPI_KEY}`
    )
      .then(response => response.json())
      .then(result => {
        station.readings.push({
          code: result.cod,
          temperature: result.main.temp,
          windSpeed: result.wind.speed,
          windDirection: result.wind.deg,
          pressure: result.main.pressure,
        })
      })
      .then(() => {
        station.save()
        res.redirect('/stations/' + req.params.id)
      })
      .catch(err => console.log(`there was an ${err}`))
  },
}

module.exports = stations
