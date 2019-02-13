const router = require('express').Router();
const passport  = require('passport');

/*
    localhost:3000 is my frontend app
*/

//auth logout
router.get('/logout',(req,res)=>{
    //handle with passport
    console.log(req.user.displayName + ' is logging out...');
    req.logout();
    console.log('logged out');
    res.redirect('http://localhost:3000/login');
});


//auth spotify
router.get('/spotify',passport.authenticate('spotify',{
    scope:['user-read-email', 'user-read-private']
}));

//callback route for spotify to redirect to
router.get('/spotify/redirect',passport.authenticate('spotify'),(req,res)=>{
    console.log(req.user.displayName + ' logged in');
    // making redirect with data into the uri, decoded in the frontend
    res.redirect(encodeURI('http://localhost:3000/decoding/' + encodeURIComponent(JSON.stringify(req.user))));
});

module.exports = router;