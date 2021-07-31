const Station = require('../models/Station')
const auth = require('../utils/auth')
const stationUtils = require('../utils/station')

const dashboard = {
  async index(req, res) {
    try {
      const stations = await Station.find({
        userId: req.session.userId,
      })
        .lean()
        .then(data => {
          return data
        })
        .catch(err => {
          console.log(err)
        })
      stations.forEach(station => {
        stationUtils.generateLatestWeather(station)
      })
      const viewData = {
        stations: stationUtils.sortStationsAlphabetically(stations),
      }
      res.render('dashboard', viewData)
    } catch (err) {
      console.log(`Error rendering dashboard`)
    }
  },
  logout(req, res) {
    req.session.loggedIn = false
    req.session.destroy()
    res.redirect('/')
  },
}

module.exports = dashboard
