// Server setup
require('dotenv').config()
const PORT = process.env.PORT || 3000
const express = require('express')
const path = require('path')
const app = express()

const session = require('express-session')
const redis = require('redis')
const redisClient = redis.createClient(process.env.REDIS_URL)
const redisStore = require('connect-redis')(session)

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
      host: process.env.REDIS_URL,
      port: 6379,
      client: redisClient,
      ttl: 86400,
    }),
  })
)

// set up db
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const db = process.env.MONGODB_URI
const connectDB = async () => {
  try {
    await mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connected to MongoDB')
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
    helpers: require('./utils/helpers'),
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
app.use(
  '/bs-icons',
  express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font'))
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
app.listen(PORT, () => {
  console.log(`Weathertop app listening on port ${PORT}`)
})
