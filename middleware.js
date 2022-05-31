module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ //passport provides us this function and also req.user which we can use to deserialize information from the session 
        req.session.returnTo = req.originalURL; //stores it in the session so we have persistence between different requests and add statefullness
        req.flash('error', 'You must be signed in');
        return res.redirect('/login'); 
    }
    next();
}