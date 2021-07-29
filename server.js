// Server setup
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')

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
const routes = require('./routes/routes')
app.use('/', routes)

// start server
app.listen(3000, () => {
  console.log(`Example app listening on http://localhost:3000`)
})
