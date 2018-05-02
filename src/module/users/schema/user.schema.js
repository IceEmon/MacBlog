/**
 * Created by Emonice on 2017/11/11.
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const makeRepo = require('../../../../middleware/repo/makeRepo')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: Object,
    description: String,
    gender: {
        type: String,
        enum: ['m', 'f', 'x']
    },
    createdAt: Date,
    createdBy: ObjectId,
    updatedAt: Date,
    updatedBy: ObjectId
});
function allKeys() {
    return _.without(_.keys(userSchema.paths), '__v');
}

userSchema.statics.orderKey = function () {
    return 'name -createdAt';
};

userSchema.methods.view = function () {
    return _.pick(this, allKeys());
};

module.exports = makeRepo(mongoose.model('User', userSchema));
