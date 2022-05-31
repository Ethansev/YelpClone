const express = require('express');
const router = express.Router({mergeParams: true}); //mergeParams merges the params in both this file and app.js so we can get access to the campground id
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas.js');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;