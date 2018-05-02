/**
 * Created by binshan on 2017/11/12.
 * 评论
 */
const Comments = require('./schema/comments.schema');
const Marked = require('../../until/marked')
module.exports = {
    createComments,
    getComments,
    getCommentsById,
    delCommentsByPostId,
    delCommentById
};
// 创建一个留言
function createComments(comment) {
    data.createdAt = new Date();
    data.updatedAt = new Date();
    return Comments.add(comment)
        .then(comment =>{
            if(!comment)return comment;
            return Marked.contentToMarked(comment);
        })
}

// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
function getComments(postId){
    return Comments.query({postId:postId});
}

function getCommentsById(id,projection){
    return Comments.queryById(id,projection);
}

// 通过文章 id 删除该文章下所有留言
function delCommentsByPostId(postId) {
    let where = {postId: postId};
    return Comments.removeBy(where);
}
// 通过用户 id 和留言 id 删除一个留言
function delCommentById(commentId) {
    return Comments.removeById(commentId);
}

