module.exports = {
  spotify: {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    b64_CID_CSECRET: process.env.b64_CID_CSECRET,
    redirectUri: process.env.REDIRECT_URI
  },
  mongoDB: {
    dbURI: process.env.DB_URI
  },
  session: {
    cookieKey: process.env.COOKIE_KEY
  },
  frontend_home: process.env.FRONTEND_HOME,
  frontend_decode: process.env.FRONTEND_DECODE,
  backend_refresh_token: process.env.BACKEND_REFRESH_TOKEN
}
