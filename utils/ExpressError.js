class ExpressError extends Error{
    constructor(message, statusCode){
        super(); //super calls the Error constructor
        this.message = message;
        this.statusCode = statusCode;
    }

}

module.exports = ExpressError;