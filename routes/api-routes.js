const router = require('express').Router();
const fetch = require('node-fetch');
const keys = require('../config/keys');


const BACKEND_REFRESH_TOKEN_URL = keys.backend_refresh_token;


// get top tracks or artists or genre
router.get('/top/:type/:id', (req, res) => {
    if(req.params.type !== 'genre'){
    fetch(BACKEND_REFRESH_TOKEN_URL + req.params.id)
        .then(response => response.json())
        .then(data => {
            fetch('https://api.spotify.com/v1/me/top/' + req.params.type, {
                headers: {
                    'Authorization': 'Bearer ' + data.access_token,
                }
            })
                .then(res => res.json())
                .then(items => {
                    res.send(JSON.stringify(items))
                })
                .catch(err => res.send(JSON.stringify(err)));
        })
    }else{
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

module.exports = router;