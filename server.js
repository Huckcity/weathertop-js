// Server setup
require('dotenv').config()
const express = require('express')
const path = require('path')

const session = require('express-session')
const redis = require('redis')
const redisClient = redis.createClient()
const redisStore = require('connect-redis')(session)

const app = express()

redisClient.on('error', err => {
  console.log(`Redis error: ${err}`)
})

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    name: 'weathertopLogin',
    saveUninitialized: true,
    cookie: { secure: false },
    store: new redisStore({
      host: 'localhost',
      port: 6379,
      client: redisClient,
      ttl: 86400,
    }),
  })
)

// set up db
const mongoose = require('mongoose')
const db = process.env.MONGODB_URI
const connectDB = async () => {
  try {
    await mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('connented to db')
      })
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
connectDB()

// set template engine to handlbars
const exphbs = require('express-handlebars')
app.engine(
  '.hbs',
  exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
  })
)
app.set('view engine', '.hbs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(
  '/bootstrap',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))
)

// set routes
const publicRoutes = require('./routes/public')
const privateRoutes = require('./routes/private')
app.use('/', publicRoutes)

app.use(function (req, res, next) {
  if (!req.session.loggedIn) {
    return res.status(403).redirect('/')
  }
  next()
})

app.use('/', privateRoutes)

// start server
app.listen(3000, () => {
  console.log(`Example app listening on http://localhost:3000`)
})
