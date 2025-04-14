const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: Boolean, required: true },
},{versionKey : false});

module.exports = mongoose.model('Users', userSchema, 'Users');