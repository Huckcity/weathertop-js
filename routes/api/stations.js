const router = require('express').Router()
const Station = require('../../models/Station')

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
    .then((station) => {
      console.log(station)
      res.json(station)
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
    .then((station) =>
      console.log({ msg: 'Station added successfully' }),
      res.redirect('/')
    )
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
router.delete('/delete/:id', (req, res) => {
  const item = Station.findById(req.params.id);
    if (!item) throw Error('No item found');
  Station.remove(req.params.id)
    .then((station) =>
      res.json({ mgs: 'Station entry deleted successfully' })
    )
    .catch((err) =>
      res.status(404).json({ error: 'No such station' })
    )
})

module.exports = router
