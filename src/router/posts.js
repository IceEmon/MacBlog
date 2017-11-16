/**
 * Created by binshan on 2017/11/12.
 * 文章
 */
const Posts = require('../module/posts/posts.domain')
const Comments = require('../module/comments/comments.domain')
const checkLogin = require('../../middleware/check').checkLogin;
const queryFilter = require('../../middleware/filter');

module.exports = router => {
    router.get('/',show);
    router.post('/', checkLogin,pubPost);
    router.get('/create', checkLogin,showPost);
    router.get('/:postId',singlePubPost);
    router.get('/:postId/edit',checkLogin,editPost);
    router.post('/:postId/edit', checkLogin,updatePost);
    router.get('/:postId/remove', checkLogin,removePost);
    router.post('/:postId/comment', checkLogin,createComment);
    router.get('/:postId/comment/:commentId/remove', checkLogin,removeComment);
};
// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
function show(req, res, next) {
    // res.send(req.flash());
    // res.render('posts');
    let author = req.query.author;
    let filter = queryFilter(req);
    filter.where.author = author;
    Posts.getPosts(filter)
        .then(function (posts) {
            res.render('posts', {
                posts: posts
            });
        })
        .catch(next);
};

// POST /posts 发表一篇文章
function pubPost(req, res, next) {
    let author = req.session.user._id;
    let title = req.fields.title;
    let content = req.fields.content;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题');
        }
        if (!content.length) {
            throw new Error('请填写内容');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    let post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };

    Posts.create(post)
        .then(function (result) {
            // 此 post 是插入 mongodb 后的值，包含 _id
            post = result.ops[0];
            req.flash('success', '发表成功');
            // 发表成功后跳转到该文章页
            res.redirect(`/posts/${post._id}`);
        })
        .catch(next);
};

// GET /posts/create 发表文章页
function showPost(req, res, next) {
    // res.send(req.flash());
    res.render('create');
};

// GET /posts/:postId 单独一篇的文章页
function singlePubPost(req, res, next) {
    let postId = req.params.postId;
    let filter = queryFilter(req);
    filter.where.postId = postId;
    Promise.all([
        Posts.getPostById(postId,filter),// 获取文章信息
        Comments.getComments(postId),// 获取该文章所有留言
        Posts.incPv(postId)// pv 加 1
    ])
        .then(function (result) {
            var post = result[0];
            var comments = result[1];
            if (!post) {
                throw new Error('该文章不存在');
            }

            res.render('post', {
                post: post,
                comments: comments
            });
        })
        .catch(next);
};

// GET /posts/:postId/edit 更新文章页(源生文章)
function editPost(req, res, next) {
    // res.send(req.flash());
    let postId = req.params.postId;
    let author = req.session.user._id;

    Posts.getRawPostById(postId)
        .then(post =>{
            if(!post){
                throw new Error('该文章不存在');
            }
            if(author.toString() !== post.author._id.toString()){
                throw new Error('权限不足');
            }
            res.render('edit',{
                post : post
            });
        })
        .catch(next);
};

// POST /posts/:postId/edit 更新一篇文章
function updatePost(req, res, next) {
    // res.send(req.flash());
    let postId = req.params.postId;
    let author = req.session.user._id;
    let title = req.fields.title;
    let content = req.fields.content;

    Posts.updatePostById(postId,author,{title: title, content: content })
        .then(()=>{
            req.flash('success', '编辑文章成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/posts/${postId}`);
        })
        .catch(next);
};

// GET /posts/:postId/remove 删除一篇文章
function removePost(req, res, next) {
    // res.send(req.flash());
    let postId = req.params.postId;
    let author = req.session.user._id;

    Posts.delPostById(postId, author)
        .then(function () {
            req.flash('success', '删除文章成功');
            // 删除成功后跳转到主页
            res.redirect('/posts');
        })
        .catch(next);
};

// POST /posts/:postId/comment 创建一条留言
function createComment(req, res, next) {
    let author = req.session.user._id;
    let postId = req.params.postId;
    let content = req.fields.content;
    let comment = {
        author: author,
        postId: postId,
        content: content
    };

    Comments.create(comment)
        .then(function () {
            req.flash('success', '留言成功');
            // 留言成功后跳转到上一页
            res.redirect('back');
        })
        .catch(next);
};

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
function removeComment(req, res, next) {
    let commentId = req.params.commentId;
    let author = req.session.user._id;

    Comments.delCommentById(commentId, author)
        .then(function () {
            req.flash('success', '删除留言成功');
            // 删除成功后跳转到上一页
            res.redirect('back');
        })
        .catch(next);
};



