const { findOne } = require('../models/User')

const home = {
  index(req, res) {
    res.render('landing')
  },
  async login(req, res) {
    await User.findOne({ email: req.body.email })
      .then(
        user => {
          if (user === null || user.password !== req.body.password) {
            console.log('no user or bad password')
            res.redirect('/')
            return
          }
          req.session.loggedIn = true
          req.session.username = user.username
          req.session.userId = user._id
          res.redirect('/dashboard')
        },
        err => {
          console.log('oopsie' + err)
        }
      )
      .catch(err => {
        console.log('unknown login error')
        res.redirect('/')
      })
  },
  register(req, res) {
    res.render('register')
  },
  async doRegistration(req, res) {
    const { username, email, password, repeatPassword } = req.body
    if (password === repeatPassword) {
      res.render('register', { msg: 'not good' })
    }

    const newUser = {
      username,
      email,
      password,
    }

    await User.create(newUser, (err, result) => {
      if (err) {
        console.log(`there was a errrrr ${err}`)
      } else {
        console.log(`looks gooooooood ${result}`)
      }
    })
  },
  about(req, res) {
    res.render('about')
  },
}

module.exports = home
