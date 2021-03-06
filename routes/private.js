const router = require('express').Router()

const dashboard = require('../controllers/dashboard')
const stations = require('../controllers/stations')

// Generic error route
router.get('/oops', dashboard.errorPage)

/*** Dashboard Routes ***/
router.get('/dashboard', dashboard.index)
router.get('/logout', dashboard.logout)
router.get('/profile', dashboard.profile)
router.post('/updateProfile', dashboard.updateProfile)

/*** Station Routes ***/
// Find station by ID
router.get('/stations/:id', stations.findOne)
// Add station
router.post('/stations/add', stations.addStation)
// Delete station
router.get('/stations/delete/:id', stations.deleteStation)
// Add reading to station
router.post('/stations/:id/addreading', stations.addReading)
// Detele reading from station
router.get('/stations/:station_id/delete/:reading_id', stations.deleteReading)
// Add OpenWeatherAPI reading to station
router.post('/stations/:id/autogenerate', stations.addAPIReading)

module.exports = router
