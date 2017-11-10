/**
 * Created by Emonice on 2017/11/10.
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const logSchema = new Schema({
    level: String,
    device: String,
    createdAt: Date,
    msg: String,
    file: ObjectId,
    meta: {}
});

logSchema.methods.view = function () {
    return _.pick(this, allKeys());
    function allKeys() {
        return _.without(_.keys(logSchema.paths), '__v');
    }
};

module.exports = mongoose.model('log', logSchema);