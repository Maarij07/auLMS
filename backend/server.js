require('dotenv').config()

const CORS=require('cors')
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const app = express()

// middleware
app.use(express.json())
app.use(CORS());

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/user', userRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })