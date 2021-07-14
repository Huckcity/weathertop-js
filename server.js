// Server setup
require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const stationRoutes = require('./routes/api/stations')
const dashboardRoutes = require('./controllers/dashboard')

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

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

// set routes
app.use('/stations', stationRoutes)
app.use('/', dashboardRoutes)

// start server
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
