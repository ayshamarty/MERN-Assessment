const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator")

// @Create schema

let userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 2
    },
    password: {
        type: String,
        required: true,
        minlength: 2
    },
    password2: {
        type: String,
        required: true,
        minlength: 2
    }
})

userSchema.plugin(uniqueValidator);

// @Create model

let Users = mongoose.model(
    'Users',
    userSchema
);

module.exports = Users;
