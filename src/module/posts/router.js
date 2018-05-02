/**
 * Created by binshan on 2018/4/28.
 */
const Posts = require('./posts.domain');
const queryFilter = require('../../../middleware/filter');
const _ = require('lodash');
const Marked = require('../../until/marked')

module.exports = router =>{
    router.get('/posts/:id',getOneById);
    router.get('/posts', getPagePosts);
    router.post('/posts', addPosts);
    router.put('/posts/:id', putPosts);
    router.delete('posts/:id', deleteById);
}

function addPosts(req,res){
    let userId = req.session.userId;
    if(!userId){
        return res.send_err('the userId of session is null');
    }
    let posts = req.body;
    if(!posts){
        return res.send_err('body is null')
    }
    posts.createdBy = userId || posts.userId;
    posts.updatedBy = userId || posts.userId;

    res.send_data(Posts.createPosts(posts));
}

function putPosts(req, res){
    let id = req.params.id;
    if(!id){
        return res.send_err('id is null');
    }
    let posts = req.body;
    if(!posts){
        return res.send_err('body is null');
    }
    let userId = req.session.userId;
    if(!userId){
        return res.send_err('the userId of session is null');
    }
    posts.updatedBy = userId || posts.userId;
    res.send_data(Posts.updatePostById(id,posts));
}

function getOneById(req,res){
    let id = req.params.id;
    if(!id){
        return res.send_err('id is null');
    }

    let userId = req.session.userId;
    if(!userId){
        return res.send_err('the userId of session is null');
    }
    let p = Posts.getPostById(id)
        .then(post =>{
            if(!post) return post;
            return Posts.incPv(post._id);
        })
        .catch((err) => {
            console.log(err);
        });
    res.send_data(p);
}

function getPagePosts(req, res){
    let filter = queryFilter(req);
    return Promise.all([
        Posts.getCount(),
        Posts.getAllPosts(filter),
        Posts.getAllPostsDate(),
    ])
        .then(results => {
            let result = Marked.contentsToMarked(results[1]);
            let filterDate = _sortOutDate(results[2]);
            let obj = {
                posts: result,
                count: results[0],
                filterDate: filterDate
            };
            res.send_data(obj);
        })
        .catch(err => {
            console.log('getPageArticle is error : ', err);
        });


    function _sortOutDate(date) {
        let new_date = date.map(i => {
            return _.pick(i, 'createdAt');
        });

        let year_arr = [];
        let filter = {};

        for (let i = 0; i < new_date.length; i++) {
            let year = new Date(new_date[i].createdAt).getFullYear();
            if (_.indexOf(year_arr, year) === -1) {
                year_arr.push(year);
            }
        }


        for (let j = 0; j < year_arr.length; j++) {
            let month = new_date.filter((item) => {
                let year = new Date(item.createdAt).getFullYear();
                return year === year_arr[j];
            });
            filter[`${year_arr[j]}`] = month;
        }
        return filter;
    }
}

function deleteById(req,res){
    let id = req.params.id;
    if(!id){
        return res.send_err('id is null');
    }
    res.send_data(Posts.delPostById(id));
}
