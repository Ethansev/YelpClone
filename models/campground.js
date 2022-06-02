const mongoose = require('mongoose');
const { cloudinary } = require('../cloudinary');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    //adding an ImageSchema so we can use cloudinary to adjust image size
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = {toJSON: { virtuals: true } }; 
//by default, mongoose does not include virtuals when we convert a document to JSON, so we set virtuals to true to include them

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' 
            //object id from the review model
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){ //creating a virtual property to use data for Mapbox (but not stored in our mongo db)
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 30)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async function(doc) { //anytime a campground is deleted, all of the related reviews are also deleted
    console.log(doc);   
    if(doc){ //deletes all reviews where their id field is in the document.reviews array 
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }else if(doc.images){ //added this code to delete the file from cloudinary whenever I delete a campground
        for(const ig of doc.images){
            await cloudinary.uploader.destroy(img.filename);
        }
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);