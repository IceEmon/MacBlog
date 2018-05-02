/**
 * Created by binshan on 2017/11/12.
 * 文章
 */
const Posts = require('./schema/posts.schema');
const Comments = require('../comments/comments.domain')
const Marked = require('../../until/marked')
module.exports = {
    createPosts,
    getRawPostById,
    getPostById,
    getAllPosts,
    updatePostById,
    delPostById,
    incPv,
    getCount,
    getAllPostsDate
}
// 创建一篇文章
function createPosts(post){
    post.createdAt = new Date();
    post.updatedAt = new Date();
    return Posts.add(post)
        .then(posts =>{
            //转为转化为markdown形式
            return Marked.contentToMarked(posts)
        })
}

// 通过文章 id 获取一篇文章
function getPostById(id,projection){
    return Posts.queryById(id,projection);
}

// 获取所有用户所有文章
function getAllPosts(filter= {}){
    filter.where = filter.where || {};
    return Posts.applyFilter(filter);
}

// 通过文章 id 给 pv 加 1
function incPv(id){
    return Posts.updateById(id,{ $inc: { pv: 1 } });
}

//通过文章id获取一片原生文章（编辑文章）
function getRawPostById(postId){
    return Posts.queryById(postId);
}

// 文章id更新一篇文章
function updatePostById(id,post) {
    post.updatedAt = new Date();
    return Posts.updateById(id, post);
}

// 通过用户 id 和文章 id 删除一篇文章
function delPostById(id) {
    return Posts.removeById(id)
        .then(res =>{
            // 文章删除后，再删除该文章下的所有留言
            if(res){
                Comments.delCommentsByPostId(postId);
            }
        });
}

//获取所有的数据总数
function getCount() {
    return Posts.getCount();
}

function getAllPostsDate() {
    return Posts.query({}, {"createDate": 1});
}

