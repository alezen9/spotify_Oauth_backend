const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy
const keys = require('./keys')
const User = require('../models/user-model')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new SpotifyStrategy({
    // options for the strategy
    callbackURL: keys.spotify.redirectUri,
    clientID: keys.spotify.clientID,
    clientSecret: keys.spotify.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    // check if user exists in database
    User.findOne({
      spotifyId: profile.id
    })
      .then((currentUser) => {
        if (currentUser) {
          if (currentUser.type !== profile._json.product) {
            // update subscription
            User.updateOne(
              { spotifyId: currentUser.spotifyId },
              {
                $set: {
                  type: profile._json.product
                }
              },
              { upsert: true }
            )
              .then(userResponse => { currentUser.type = profile._json.product })
            done(null, currentUser)
          } else if (currentUser.refreshToken !== refreshToken) {
            // update refresh token
            User.updateOne(
              { spotifyId: currentUser.spotifyId },
              {
                $set: {
                  refreshToken: refreshToken
                }
              },
              { upsert: true }
            )
              .then(userResponse => { currentUser.refreshToken = refreshToken })
            done(null, currentUser)
          }
          done(null, currentUser)
        } else {
          // create new user and save it
          var d = new Date()
          new User({
            displayName: profile.displayName,
            spotifyId: profile.id,
            email: profile._json.email,
            type: profile._json.product,
            refreshToken: refreshToken,
            country: profile._json.country
          }).save()
            .then((newUser) => { done(null, newUser) })
        }
      })
  })
)
