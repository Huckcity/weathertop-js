const router = require('express').Router()

const dashboard = require('../controllers/dashboard')
const stations = require('../controllers/stations')

/*** Dashboard Routes ***/
router.get('/dashboard', dashboard.index)
router.get('/logout', dashboard.logout)

/*** Station Routes ***/
// Find station by ID
router.get('/stations/:id', stations.findOne)
// Add station
router.post('/stations/add', stations.addStation)
// Update station
router.put('/stations/:id/update', stations.updateStation)
// Delete station
router.get('/stations/delete/:id', stations.deleteStation)
// Add reading to station
router.post('/stations/:id/addreading', stations.addReading)
// Add OpenWeatherAPI reading to station
router.post('/stations/:id/autogenerate', stations.addAPIReading)

module.exports = router
