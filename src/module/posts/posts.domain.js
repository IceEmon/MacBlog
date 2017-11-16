/**
 * Created by binshan on 2017/11/12.
 * 文章
 */
const PostsSchema = require('./schema/posts.schema');
const repo = require('../../../middleware/repo');
const Comments = require('../comments/comments.domain')
module.exports = {
    create,
    getRawPostById,
    getPostById,
    getPosts,
    updatePostById,
    delPostById,
    incPv
}
// 创建一篇文章
function create(post){
    return repo.add(PostsSchema,post)
}

// 通过文章 id 获取一篇文章
function getPostById(postId,filter= {}){
    filter.sort = {sort:{_id : postId}};
    return repo.applyFilter(PostsSchema,filter);
}

// 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
function getPosts(filter= {}){
    filter.sort = {sort:{ _id: -1 }};
    return repo.applyFilter(PostsSchema,filter);
}

// 通过文章 id 给 pv 加 1
function incPv(postId){
    return repo.updateById(PostsSchema,postId,{ $inc: { pv: 1 } });
}

//通过文章id获取一片原生文章（编辑文章）
function getRawPostById(postId){
    return repo.queryById(PostsSchema,postId);
}

// 通过用户 id 和文章 id 更新一篇文章
function updatePostById(postId,author,data) {
    let where = {author: author, _id: postId };
    let updateData = {$set: data};
    return repo.update(PostsSchema,where,updateData);
}

// 通过用户 id 和文章 id 删除一篇文章
function delPostById(postId, author) {
    let where = {author: author, _id: postId};
    return repo.removeBy(PostsSchema,where)
        .then(res =>{
                // 文章删除后，再删除该文章下的所有留言
                if(res.result.ok && res.result.n>0){
                    Comments.delCommentsByPostId(postId);
                }
            }
        );
}
