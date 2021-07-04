// Server setup
require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const stationRoutes = require('./routes/api/stations')

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
app.set('view engine', '.hbs')
app.engine(
  '.hbs',
  exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
  })
)
app.set('view engine', '.hbs')

app.use(express.static('public'))

// set routes
app.use('/stations', stationRoutes)
app.get('/', (req, res) => {
  res.render('dashboard')
})

// start server
app.listen(port, () => {
  console.log(`Example app listening on http:/localhost:${port}`)
})
