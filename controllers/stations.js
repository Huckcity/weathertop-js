const fetch = require('node-fetch')
const auth = require('../utils/auth')
const Station = require('../models/Station')
const Reading = require('../models/Reading')
const stationUtils = require('../utils/station')

const stations = {
  async findOne(req, res) {
    Station.findById(req.params.id)
      .lean()
      .then(station => {
        const viewData = {
          station: stationUtils.generateLatestWeather(station),
          chartData: stationUtils.generateChartData(station),
        }
        res.render('station', viewData)
      })
      .catch(err => {
        console.log(err)
        res.redirect('/dashboard')
      })
  },
  async addStation(req, res) {
    const { name, lat, lng } = req.body
    Station.create({
      name,
      lat,
      lng,
      readings: [],
      userId: await auth.currentUserID(req.session.userId),
    })
      .then(station => {
        console.log({ msg: 'Station added successfully:' + station })
        res.redirect('/dashboard')
      })
      .catch(err => {
        console.log(err.message)
        res.status(400).json({ error: 'Unable to add this station' })
        res.redirect('/dashboard')
      })
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
    await Station.findByIdAndUpdate(req.params.id, {
      $push: { readings: reading },
    })
      .then(() => {
        res.redirect('/stations/' + req.params.id)
      })
      .catch(err => {
        console.log(err)
      })
  },
  async deleteReading(req, res) {
    const station = await Station.findOneAndUpdate(
      {
        _id: req.params.station_id,
      },
      {
        $pull: {
          readings: {
            _id: req.params.reading_id,
          },
        },
      }
    )
      .then(result => {
        console.log(
          `Deleting reading ${req.params.reading_id} from station ${req.params.station_id}`
        )
        res.redirect(`/stations/${req.params.station_id}`)
      })
      .catch(err => {
        console.log(`Error deleting reading: ${err}`)
        res.redirect(`/stations/${req.params.station_id}`)
      })
  },
  async addAPIReading(req, res) {
    const station = await Station.findById(req.params.id)
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${station.lat}&lon=${station.lng}&appid=${process.env.OPENWEATHERAPI_KEY}`
    )
      .then(response => response.json())
      .then(result => {
        station.readings.push({
          code: result.weather[0].id,
          temperature: result.main.temp,
          windSpeed: result.wind.speed,
          windDirection: result.wind.deg,
          pressure: result.main.pressure,
          auto_gen: true,
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
