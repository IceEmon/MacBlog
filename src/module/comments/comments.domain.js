/**
 * Created by binshan on 2017/11/12.
 * 评论
 */
const CommentsSchema = require('./schema/comments.schema');
const repo = require('../../../middleware/repo');
module.exports = {
    create,
    getComments,
    delCommentsByPostId,
    delCommentById
};
// 创建一个留言
function create(comment) {
    return repo.add(CommentsSchema,comment);
}

// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
function getComments(postId){
    return repo.query(CommentsSchema,postId);
}
// 通过文章 id 删除该文章下所有留言
function delCommentsByPostId(postId) {
    let where = {postId: postId};
    return repo.removeBy(CommentsSchema,where);
}
// 通过用户 id 和留言 id 删除一个留言
function delCommentById(commentId, author) {
    let where = { author: author, _id: commentId };
    return repo.removeBy(CommentsSchema,where);
}

