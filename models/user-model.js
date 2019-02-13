const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    displayName: String,            // name of the user
    spotifyId: String,              // unique id
    email: String,
    type: String,                   // subscription typed
    accessToken: String,
    refreshToken: String
});

const User = mongoose.model('user',userSchema);

module.exports = User;