const router = require('express').Router()

const fetch = require('node-fetch')

const Station = require('../../models/Station')
const Reading = require('../../models/Reading')

// @route GET api/stations
// @description Get all stations
// @access Public
router.get('/', (req, res) => {
  Station.find()
    .then((stations) => {
      res.json(stations)
    })
    .catch((err) =>
      res.status(404).json({
        noStations: 'No stations found',
      })
    )
})

// @route GET api/stations/:id
// @description Get a station by id
// @access Public
router.get('/:id', (req, res) => {
  Station.findById(req.params.id)
    .lean()
    .then((station) => {
      console.log(station.readings)
      res.render('station', station)
    })
    .catch((err) =>
      res.status(404).json({
        noStations: 'No station found for id: ' + req.params.id,
      })
    )
})

// @route POST api/stations
// @description add/save station
// @access Public
router.post('/add', (req, res) => {
  console.log(req.body)
  Station.create(req.body)
    .then((station) => console.log({ msg: 'Station added successfully' }))
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      console.log(err.message)
      res.status(400).json({ error: 'Unable to add this station' })
    })
})

// @route UPDATE api/stations/:id
// @description Update book
// @access Public
router.put('/:id/update', (req, res) => {
  Station.findByIdAndUpdate(req.params.id, req.body)
    .then((station) => res.json({ msg: 'Updated successfully' }))
    .catch((err) =>
      res.status(400).json({
        error: 'Unable to update the station ' + req.params.id,
      })
    )
})

// @route DELETE api/stations/:id
// @description Delete station by id
// @access Public
router.get('/delete/:id', (req, res) => {
  Station.findByIdAndDelete(req.params.id)
    .then((data) => console.log(`${data} was deleted`))
    .then(() => res.redirect('/'))
    .catch((err) => {
      res.status(400).json({
        error: 'Unable to delete station',
      })
    })
})

router.post('/:id/addreading', (req, res) => {
  const reading = new Reading(req.body)
  Station.findByIdAndUpdate(req.params.id, { $push: { readings: reading } })
    .then(() => {
      res.redirect('/stations/' + req.params.id)
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/:id/autogenerate', async (req, res) => {
  const station = await Station.findById(req.params.id)
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${station.lat}&lon=${station.lng}&appid=${process.env.OPENWEATHERAPI_KEY}`
  )
    .then((response) => response.json())
    .then((result) => {
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
    .catch((err) => console.log(err))
})

module.exports = router
