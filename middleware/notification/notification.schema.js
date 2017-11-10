/**
 * Created by Emonice on 2017/11/10.
 */

const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const notificationSchema = new Schema({
    type: String,
    projectId: ObjectId,
    from: ObjectId,
    to: ObjectId,
    date: Date,
    handledDate: Date,
    data: {}
});

function allKeys() {
    return _.without(_.keys(notificationSchema.paths), '__v');
}

notificationSchema.statics.orderKey = function () {
    return '-date';
};

notificationSchema.methods.view = function () {
    return _.pick(this, allKeys());
};

module.exports = mongoose.model('Notification', notificationSchema);