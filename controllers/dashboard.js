const Station = require('../models/Station')
const User = require('../models/User')
const auth = require('../utils/auth')
const stationUtils = require('../utils/station')

const mqtt = require('mqtt')

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

// const http = require('http');
// const WebSocketServer = require('websocket').server;
// const server = http.createServer();
// server.listen(8080);
// const wsServer = new WebSocketServer({
//     httpServer: server
// });



const dashboard = {
  async index(req, res) {
    try {
      const stations = await Station.find({
        userId: req.session.userId,
      }).lean()

      // Generate stats and add to stations
      stations.forEach(station => {
        if (station.readings.length > 0)
          stationUtils.generateLatestWeather(station)
      })

      const viewData = {
        stations: stationUtils.sortStationsAlphabetically(stations),
      }
      res.render('dashboard', viewData)
    } catch (err) {
      console.log(`Error rendering dashboard: ${err}`)
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
    const viewData = {
      user: currentUser,
      msg: req.session.msg,
      err: req.session.err
    }
    req.session.msg = null;
    req.session.err = null;
    res.render('profile', viewData)
  },
  async updateProfile(req, res) {
    const currentUser = await auth.currentUserInfo(req.session.userId)

    if (req.body.old_password) {
      if (req.body.old_password === currentUser.password && req.body.new_password && req.body.new_password === req.body.repeat_password) {
        User.findByIdAndUpdate(currentUser._id, {
          $set: {
            fname: req.body.fname,
            lname: req.body.lname,
            password: req.body.new_password
          },
        })
        .then(() => {
          req.session.msg = 'Profile updated.'
          res.redirect('/profile')
        })
        .catch(err => {
          console.log(err)
          req.session.err = 'Error updating profile. Please try again later.'
          res.redirect('/profile')
        })
      } else {
        req.session.err = 'Incorrect password or password mismatch.'
        res.redirect('/profile')
      }
    } else {
      User.findByIdAndUpdate(currentUser._id, {
        $set: {
          fname: req.body.fname,
          lname: req.body.lname,
        },
      })
      .then(() => {
        req.session.msg = 'Profile updated.'
        res.redirect('/profile')
      })
      .catch(err => {
        console.log(err)
        req.session.err = 'Error updating profile. Please try again later.'
        res.redirect('/profile')
      })
    }
  },
  errorPage(req, res) {
    res.render('errorPage')
  },

  locations(req, res) {
    const client = mqtt.connect('mqtt://208.113.166.76')

    client.on('connect', () => {
      console.log('Connected to MQTT broker')
      client.subscribe('zigbee2mqtt/MotionSensor')
    })
    
    wss.on('connection', ws => {
        client.on('message', (topic, message) => {
        console.log(`Received message on topic ${topic}: ${message}`)
        ws.send(JSON.stringify(message))
      })
    })
    
    // client.end()
    res.render('locations')
  },
}

module.exports = dashboard
