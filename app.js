const express = require('express')
const authRoutes = require('./routes/auth-routes')
const apiRoutes = require('./routes/api-routes')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const cookieSession = require('cookie-session')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // in milliseconds (1 day here)
  keys: [keys.session.cookieKey] // key to encrypt data in the cookie
}))

// initialaze passport
app.use(passport.initialize())
app.use(passport.session())

// db connection
mongoose.connect(keys.mongoDB.dbURI, { useNewUrlParser: true, dbName: 'intersecDB' }, () => {
  console.log('connected to mongodb')
})

// set up routes
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)

app.listen(5000, () => {
  console.log('app listening for requests on port 5000')
})
