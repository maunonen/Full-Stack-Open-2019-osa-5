const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const userRoute = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')


mongoose.connect( config.MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error: Can not connect to MongoDB', error.message )
  })  
app.use(cors())
app.use(bodyParser.json())
app.use(middleware.reqLogger)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRoute)

app.use(middleware.errorHandler)

module.exports = app