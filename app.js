const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
//
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true, can take this out in newer versions of mongoose
    useUnifiedTopology: true
});

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded( {extended:true} ));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); //serves the public directory

const sessionConfig = {
    secret:'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //for security so client-side can't alter cookies
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //date.now() returns in milliseconds so we do this to expire in 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews); //need to use mergeParams: true in reviews.js if we need access to this id

app.get('/', (req, res ) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
}) //for every path we're going to call this callback

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong"
    res.status(statusCode).render('error', { err }); //we're passing in err to use for ejs
});

app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')                                                                                                                     
});