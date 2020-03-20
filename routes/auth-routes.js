const router = require('express').Router()
const passport = require('passport')
const User = require('../models/user-model')
const keys = require('../config/keys')
const fetch = require('node-fetch')

const FRONTEND_HOME_URL = keys.frontend_home
const FRONTEND_DECODING_PAGE_URL = keys.frontend_decode

// auth logout
router.get('/logout', (req, res) => {
  const { displayName } = req.user
  console.log(displayName + ' is logging out...')
  req.logout()
  console.log(displayName + ' logged out')
  res.redirect(FRONTEND_HOME_URL)
})

// auth spotify
router.get('/spotify', passport.authenticate('spotify', {
  scope: ['user-read-email', 'user-read-private', 'user-top-read', 'streaming', 'user-read-birthdate']
}))

// callback route for spotify to redirect to
router.get('/spotify/redirect', passport.authenticate('spotify'), (req, res) => {
  const { spotifyId, type, displayName, country } = req.user
  console.log(displayName + ' logged in')
  let userFiltered = {
    spotifyId: spotifyId,
    type: type,
    displayName: displayName,
    country: country
  }
  // send userFiltered parameters in uri to docoding page
  res.redirect(encodeURI(FRONTEND_DECODING_PAGE_URL + encodeURIComponent(JSON.stringify(userFiltered))))
})

// refresh access token with given id if needed else return access token from db
router.get('/refresh/:id', (req, res) => {
  User.findOne({ spotifyId: req.params.id })
    .then(response => {
      // request and update access token
      var details = {
        grant_type: 'refresh_token',
        refresh_token: response.refreshToken
      }

      var formBody = []
      for (var property in details) {
        var encodedKey = encodeURIComponent(property)
        var encodedValue = encodeURIComponent(details[property])
        formBody.push(encodedKey + '=' + encodedValue)
      }
      formBody = formBody.join('&')

      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        Vary: 'Origin',
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Authorization': 'Basic ' + keys.spotify.b64_CID_CSECRET,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      })
        .then(resp => resp.json())
        .then(data => {
          let A_TOKEN = {
            access_token: data.access_token
          }
          res.send(JSON.stringify(A_TOKEN))
        })
        .catch(err => res.send(JSON.stringify(err)))
    })
    .catch(err => res.send(JSON.stringify(err)))
})

module.exports = router
