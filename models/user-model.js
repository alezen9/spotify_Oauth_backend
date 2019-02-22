const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    displayName: String,
    spotifyId: String,
    email: String,
    type: String,
    accessToken: String,
    refreshToken: String,
    accessTokenUntil: Number,
    country: String
});

const User = mongoose.model('user',userSchema);

module.exports = User;