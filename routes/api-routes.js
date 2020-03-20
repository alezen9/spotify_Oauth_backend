const router = require('express').Router()
const fetch = require('node-fetch')
const keys = require('../config/keys')
const queryString = require('query-string')

const BACKEND_REFRESH_TOKEN_URL = keys.backend_refresh_token

// get top tracks or artists or genre
router.get('/top/:type/:id', (req, res) => {
  const { type, id } = req.params
  if (type !== 'genre') {
    fetch(BACKEND_REFRESH_TOKEN_URL + id)
      .then(response => response.json())
      .then(A_TOKEN => {
        fetch('https://api.spotify.com/v1/me/top/' + type, {
          headers: {
            'Authorization': 'Bearer ' + A_TOKEN.access_token
          }
        })
          .then(res => res.json())
          .then(items => { res.send(JSON.stringify(items)) })
          .catch(err => res.send(JSON.stringify(err)))
      })
  } else {
    fetch(BACKEND_REFRESH_TOKEN_URL + id)
      .then(response => response.json())
      .then(A_TOKEN => {
        fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + A_TOKEN.access_token
          }
        })
          .then(res => res.json())
          .then(items => { res.send(JSON.stringify(items)) })
          .catch(err => res.send(JSON.stringify(err)))
      })
  }
})

// get recommendations by seeds
router.post('/reccomendations/seed/:id', (req, res) => {
  const { sliders, genres } = req.body.options
  fetch(BACKEND_REFRESH_TOKEN_URL + req.params.id)
    .then(response => response.json())
    .then(A_TOKEN => {
      let opt = {
        target_acousticness: sliders.acousticness,
        target_danceability: sliders.danceability,
        target_energy: sliders.energy,
        target_instrumentalness: sliders.instrumentalness,
        target_liveness: sliders.liveness,
        target_speechiness: sliders.speechiness,
        target_valence: sliders.valence
      }
      if (genres) { opt.seed_genres = genres.join() }
      fetch('	https://api.spotify.com/v1/recommendations?' + queryString.stringify(opt), {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + A_TOKEN.access_token
        }
      })
        .then(res => res.json())
        .then(results => { res.send(JSON.stringify(results)) })
        .catch(err => res.send(JSON.stringify(err)))
    })
})

module.exports = router
