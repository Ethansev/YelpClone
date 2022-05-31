const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfuly made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`) //redirects us back to the campground at id after creating a new one. 
    
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // ^ populates all the user reviews, then populate the author of each review, and lastly populate the one author on the campground
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req,res) => {
    //first checks if the campground exists, if it does the function then checks if the user and author are the same person to authorize them to make edits
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res) => {
    //we're updating a campground at the specific id in the database and sending it as a put request 
    //first checking if the user is authorized to make an update by comparing the .author with the req.user.id
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}) //we're spreading the object
    req.flash('success', 'Successfuly updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isAuthor, catchAsync(async (req, res) => {
    //deletes the object from our campgrounds collection
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;