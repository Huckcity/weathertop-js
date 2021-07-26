const express = require('express')
const router = express.Router()

const dashboard = require('../controllers/dashboard')

router.get('/', dashboard.index)
router.get('/dashboard', dashboard.index)

module.exports = router