const express = require('express')
const router = express.Router()

const home = require('../controllers/home')

/*** Home Routes ***/
router.get('/', home.index)
router.get('/register', home.register)
router.post('/register', home.doRegistration)
router.get('/about', home.about)
router.post('/login', home.login)

module.exports = router
