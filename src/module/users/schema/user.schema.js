/**
 * Created by Emonice on 2017/11/11.
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        index: true,
        type: String,
        unique:true,
        required: '{PATH} is required!'
    },
    password: String,
    avatar: String, //头像
    gender: {
        type: String,
        enum: ['m', 'f', 'x']
    },
    bio: String //个人简介
});
function allKeys() {
    return _.without(_.keys(userSchema.paths), '__v');//'__v', //包含文档的内部修订,默认的是__v
}

userSchema.statics.orderKey = function () {
    return 'name';
};

userSchema.methods.view = function () {
    return _.pick(this, allKeys());
};

module.exports = mongoose.model('User', userSchema);