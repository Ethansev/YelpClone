const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Campground = require('./models/campground');
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ //passport provides us this function and also req.user which we can use to deserialize information from the session 
        req.session.returnTo = req.originalURL; //stores it in the session so we have persistence between different requests and add statefullness
        req.flash('error', 'You must be signed in');
        return res.redirect('/login'); 
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    //authorization by comparing the .author with the req.user.id which stops if they do not match 
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    //middleware function for server-side validations using Joi
    const { error } = campgroundSchema.validate(req.body); //validates the parameters we setup in the schema as a boolean
    if(error){
        const msg = error.details.map(el => el.message).join(','); //we're taking the details array in Object and mapping over it to give us a new string
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(','); //we're taking the details array in Object and mapping over it to give us a new string
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}