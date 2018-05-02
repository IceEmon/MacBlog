/**
 * Created by binshan on 2018/4/28.
 */
const Comments = require('./comments.domain');
module.exports = router =>{
    router.post('/comments',addComment);
    router.get('/posts/:id/comments',getAllComments);
    router.get('/comments/:id', getCommentsById);
    router.delete('/comments/:id', deleteCommentsById);
}

function addComment(req, res){
    let data = req.body;
    if(!data){
        return res.send_err('body is null');s
    }
    let userId = req.session.userId || data.userId;
    if(!userId){
        return res.send_err('the userId of session is null')
    }
    data.createdBy = userId;
    data.updatedBy = userId;
    res.send_data(Comments.createComments(data));
}

function getCommentsById(res,req){
    let id = req.params.id;
    if(!id){
        return res.send_err('id is null')
    }
    res.send(Comments.getCommentsById(id));
}

function getAllComments(req, res){
    let postId = req.params.id;
    if(!postId){
        return res.send_err('postsId is null');
    }
    res.send(Comments.getComments(postId));
}

function deleteCommentsById(req, res){
    let id = req.params.id;
    if(!id){
        return res.send_err('id is null');
    }
    res.send_data(Comments.delCommentById(id));
}

