/**
 * Created by Emonice on 2017/11/11.
 * 评论
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const makeRepo = require('../../../../middleware/repo/makeRepo')

const commentsSchema = new Schema({
    createdBy: {
        index: true,
        type: ObjectId,
        required: '{PATH} is required!'
    },
    content: String,
    postId: { index: true,
        type: ObjectId,
        required: '{PATH} is required!'
    },
    createdAt: Date,
    updatedAt: Date,
    updatedBy: ObjectId
});
function allKeys() {
    return _.without(_.keys(commentsSchema.paths), '__v');
}

commentsSchema.statics.orderKey = function () {
    return '_id';
};

commentsSchema.methods.view = function () {
    return _.pick(this, allKeys());
};

module.exports = makeRepo(mongoose.model('Comments', commentsSchema));
