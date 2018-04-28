/**
 * Created by Emonice on 2017/11/11.
 * 文章
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const postsSchema = new Schema({
    author: ObjectId,
    title: String,
    content: String,
    pv : Number//点击量
});
function allKeys() {
    return _.without(_.keys(postsSchema.paths), '__v');//'__v', //包含文档的内部修订,默认的是__v
}

postsSchema.statics.orderKey = function () {
    return '_id';
};

postsSchema.methods.view = function () {
    return _.pick(this, allKeys());
};

module.exports = mongoose.model('Posts', postsSchema);
