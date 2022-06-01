const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfuly made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`) //redirects us back to the campground at id after creating a new one. 
    
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.renderEditForm = async (req,res) => {
    //first checks if the campground exists, if it does the function then checks if the user and author are the same person to authorize them to make edits
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async(req, res) => {
    //we're sending a put request to update a campground at the specific id in the database
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}) //we're spreading the object
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs); //use push so we don't overwrite existing data
    //^ doesn't pass in an array, but takes the data in the array and passes it to push
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename); //deletes the image file from cloudinary
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        //update our campground where we pull from the images array, all images where the filename of the images are in the req.body.deleteImages array. 
        console.log(campground);
    }
    campground.save();
    req.flash('success', 'Successfuly updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteCampground = async (req, res) => {
    //deletes the object from our campgrounds collection
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
};