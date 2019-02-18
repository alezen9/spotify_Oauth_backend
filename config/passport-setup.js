const passport  = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    })
});


passport.use(
    new SpotifyStrategy({
        //options for the strategy
        callbackURL:'/auth/spotify/redirect',
        clientID: keys.spotify.clientID,
        clientSecret:keys.spotify.clientSecret
    },(accessToken,refreshToken,profile,done)=>{
        //check if user exists in database
        User.findOne({
            spotifyId: profile.id
        }).then((currentUser)=>{
            if(currentUser){
                done(null, currentUser);
            }else{
                //create new user and save it
                var d = new Date();
                new User({
                    displayName: profile.displayName,
                    spotifyId: profile.id,
                    email: profile._json.email,
                    type: profile._json.product,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    accessTokenUntil: (d.getTime() / 1000) + 3300
                }).save().then((newUser)=>{
                    done(null, newUser);
                })  
            }
        });
    })
);