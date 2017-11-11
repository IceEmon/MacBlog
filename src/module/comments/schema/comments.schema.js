/**
 * Created by Emonice on 2017/11/11.
 * 评论
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentsSchema = new Schema({
    author: {
        index: true,
        type: ObjectId,
        required: '{PATH} is required!'
    },
    content: String,
    postId: { index: true,
        type: ObjectId,
        required: '{PATH} is required!'
    }
});
function allKeys() {
    return _.without(_.keys(commentsSchema.paths), '__v');//'__v', //包含文档的内部修订,默认的是__v
}

commentsSchema.statics.orderKey = function () {
    return '_id';
};

commentsSchema.methods.view = function () {
    return _.pick(this, allKeys());
};

module.exports = mongoose.model('Comments', commentsSchema);