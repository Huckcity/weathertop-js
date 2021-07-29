const express = require('express')
const router = express.Router()

const home = require('../controllers/home')
const dashboard = require('../controllers/dashboard')
const stations = require('../controllers/stations')

/*** Home Routes ***/
router.get('/', home.index)
router.get('/register', home.register)
router.post('/register', home.doRegistration)
router.get('/about', home.about)
router.post('/login', home.login)
/*** Dashboard Routes ***/
router.get('/dashboard', dashboard.index)

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
