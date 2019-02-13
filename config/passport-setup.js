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
        //passport callback function
        //check if user exists in database
        //console.dir(profile,{depth: 3,colors: true});
        User.findOne({
            spotifyId: profile.id
        }).then((currentUser)=>{
            if(currentUser){
                //already have user
                //console.log('user is: ' + currentUser);
                if(currentUser.accessToken != accessToken){
                    // update accessToken
                }
                if(currentUser.refreshToken != refreshToken){
                    // update refreshToken
                }
                done(null, currentUser);
            }else{
                //create new user and save it
                new User({
                    displayName: profile.displayName,
                    spotifyId: profile.id,
                    email: profile._json.email,
                    type: profile._json.type,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }).save().then((newUser)=>{
                    //console.log('new user created: ' + newUser);
                    done(null, newUser);
                })  
            }
        });
    })
);