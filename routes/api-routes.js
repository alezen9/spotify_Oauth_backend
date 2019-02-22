const router = require('express').Router();
const fetch = require('node-fetch');
const keys = require('../config/keys');
const queryString = require('query-string');

const BACKEND_REFRESH_TOKEN_URL = keys.backend_refresh_token;


// get top tracks or artists or genre
router.get('/top/:type/:id', (req, res) => {
    if (req.params.type !== 'genre') {
        fetch(BACKEND_REFRESH_TOKEN_URL + req.params.id)
            .then(response => response.json())
            .then(A_TOKEN => {
                fetch('https://api.spotify.com/v1/me/top/' + req.params.type, {
                    headers: {
                        'Authorization': 'Bearer ' + A_TOKEN.access_token,
                    }
                })
                    .then(res => res.json())
                    .then(items => {
                        res.send(JSON.stringify(items))
                    })
                    .catch(err => res.send(JSON.stringify(err)));
            })
    } else {
        fetch(BACKEND_REFRESH_TOKEN_URL + req.params.id)
            .then(response => response.json())
            .then(A_TOKEN => {
                fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + A_TOKEN.access_token,
                    }
                })
                    .then(res => res.json())
                    .then(items => {
                        res.send(JSON.stringify(items))
                    })
                    .catch(err => res.send(JSON.stringify(err)));
            })
    }
});

// get recommendations by seeds
router.post('/reccomendations/seed/:id', (req, res) => {
    fetch(BACKEND_REFRESH_TOKEN_URL + req.params.id)
        .then(response => response.json())
        .then(A_TOKEN => {
            let opt = {
                target_acousticness: req.body.options.sliders.acousticness,
                target_danceability: req.body.options.sliders.danceability,
                target_energy: req.body.options.sliders.energy,
                target_instrumentalness: req.body.options.sliders.instrumentalness,
                target_liveness: req.body.options.sliders.liveness,
                target_speechiness: req.body.options.sliders.speechiness,
                target_valence: req.body.options.sliders.valence
            }
            if(req.body.options.genres){
                opt.seed_genres = req.body.options.genres.join();
            }
            fetch('	https://api.spotify.com/v1/recommendations?' + queryString.stringify(opt), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + A_TOKEN.access_token,
                }
            })
                .then(res => res.json())
                .then(results => {
                    res.send(JSON.stringify(results))
                })
                .catch(err => res.send(JSON.stringify(err)));
        })
});

module.exports = router;