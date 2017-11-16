/**
 * Created by binshan on 2017/11/16.
 * 登录
 */
const sha1 = require('sha1');

const User = require('../module/users/users.domain');
var checkNotLogin = require('../../middleware/check').checkNotLogin;

module.exports = router => {
    router.get('/',checkNotLogin,show);
    router.post('/',checkNotLogin,signin);
};
// GET /signin 登录页
function show(req, res, next) {
    // res.send(req.flash());
    res.render('signin');
};

// POST /signin 用户登录
function signin(req, res, next) {
    // res.send(req.flash());
    var name = req.fields.name;
    var password = req.fields.password;

    User.getUserByName(name)
        .then(user =>{
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('back');
            }
            //检查密码是否正确
            if(sha1(password) !== user.password){
                req.flash('error','用户名或密码错误');
                return res.redirect('back');
            }
            req.flash('success','登录成功');
            // 用户信息写入 session
            delete user.password;
            req.session.user = user;
            //跳转到主页
            res.redirect('posts');
        })
        .catch(next);
};


