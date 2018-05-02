/**
 * Created by Emonice on 2017/11/11.
 * 文章
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const makeRepo = require('../../../../middleware/repo/makeRepo')

const postsSchema = new Schema({
    title: String,
    content: String,
    pv : {
        type: Number,
        default: 0
    },//点击量
    createdAt: Date,
    updatedAt: Date,
    createdBy: ObjectId,
    updatedBy: ObjectId
});
function allKeys() {
    return _.without(_.keys(postsSchema.paths), '__v');//'__v', //包含文档的内部修订,默认的是__v
}

postsSchema.statics.orderKey = function () {
    return '_id -updatedAt -createdAt';
};

postsSchema.methods.view = function () {
    return _.pick(this, allKeys());
};

module.exports = makeRepo(mongoose.model('Posts', postsSchema));
