const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// @Create schema

let userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        minlength: 2
    },
    password: {
        type: String,
        required: true,
        minlength: 2
    }
})

// @Create model

let Users = mongoose.model(
    'Users',
    userSchema
);

module.exports = Users;
