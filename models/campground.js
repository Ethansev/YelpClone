const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
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
})

CampgroundSchema.post('findOneAndDelete', async function(doc) { //anytime a campground is deleted, all of the related reviews are also deleted
    console.log(doc);
    if(doc){ //deletes all reviews where their id field is in the document.reviews array 
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);