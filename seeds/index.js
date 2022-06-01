const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
const Campground = require("../models/campground");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

//This file is used to populate our campgrounds collection for development 

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({}); //completely empties out the database so we can reseed
    for(let i = 0;i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '6295f9d59a4a95355ea91ee4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet error deleniti sapiente delectus ad explicabo illum fugit dolorem, asperiores neque? Ullam nesciunt illo dignissimos inventore nihil repellendus, molestiae necessitatibus quo?',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/ethansev/image/upload/v1654031092/YelpClone/vvrzhvzurr4ebphxpzfq.png',
                  filename: 'YelpClone/vvrzhvzurr4ebphxpzfq',
                },
                {
                  url: 'https://res.cloudinary.com/ethansev/image/upload/v1654031091/YelpClone/tjpzezzlm1lwadbsnm53.png',
                  filename: 'YelpClone/tjpzezzlm1lwadbsnm53',
                }
              ],
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})