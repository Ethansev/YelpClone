//This file validates the front-end with the Joi package :) 

const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({ //used to sanitize html and prevent cross-site scripting
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!' //this message is returned from the code below 
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHtml(value, { //package we installed 
                    allowedTags: [],
                    allowedAttributes: {}, //we're not allowing anything :D
                });
                if(clean !== value) return helpers.error('string.escapeHTML', { value })
                //checks if there's a difference between the input passed in and the sanitized output : returns helpers.error if something was removed
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(), --testing
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required(), //has to be an object and has to be required
    deleteImages: Joi.array()
}); //validates before it gets to mongoose

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});