const Station = require('../models/Station')
const User = require('../models/User')
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

      // Generate stats and add to stations
      stations.forEach(station => {
        stationUtils.generateLatestWeather(station)
      })

      const viewData = {
        stations: stationUtils.sortStationsAlphabetically(stations),
      }
      res.render('dashboard', viewData)
    } catch (err) {
      console.log(`Error rendering dashboard`)
      res.redirect('/oops')
    }
  },
  logout(req, res) {
    req.session.loggedIn = false
    req.session.destroy()
    res.redirect('/')
  },
  async profile(req, res) {
    const currentUser = await auth.currentUserInfo(req.session.userId)
    res.render('profile', currentUser)
  },
  async updateProfile(req, res) {
    const currentUser = await auth.currentUserInfo(req.session.userId)
    User.findByIdAndUpdate(currentUser._id, {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
      },
    })
      .then(() => {
        res.redirect('/profile')
      })
      .catch(err => {
        console.log(err)
        res.redirect('/oops')
      })
  },
  errorPage(req, res) {
    res.render('errorPage')
  },
}

module.exports = dashboard
