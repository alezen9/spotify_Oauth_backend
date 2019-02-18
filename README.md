# Spotify OAuth Backend using Passport.js
The backend of a webapp based on Spotify (it can be used as template for other apps based on Spotify)

# Features
- Log in with Spotify
- Get list of top tracks and artists of the current user


# IMPORTANT
- create a file named keys.js in config directory
- add the following into the file:

  ```sh
  module.exports = {
    spotify: {
        clientID:'your_spotify_client_id',
        clientSecret:'your_spotify_client_secret',
        b64_CID_CSECRET: 'base64_encoded <client_id:client_secret>'
    },
    mongoDB: {
        dbURI: 'your_mongodb_uri'
    },
    session:{
        cookieKey:'your_random_key_for_encryption'
    },
    frontend_home: 'frontend_home_adress_or_ip_example: http://localhost:3000/',
    frontend_decode: 'frontend_decoding_page_adress_or_ip_example: http://localhost:3000/decoding/' ,
    backend_refresh_token: 'backend_adress_or_ip_plus_"/auth/refresh"_example: http://localhost:5000/auth/refresh/'
  }
  ```
