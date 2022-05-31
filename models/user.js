const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true, 
        unique: true //not considered a validation but sets up an index so we need to setup a middleware validation 
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

//instead of using bcrypt as a hash function and sessions, I'm using passport for authentication due to its flexibility 
//passport-local-mongoose adds a username, hash, and salt field