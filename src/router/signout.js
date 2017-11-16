/**
 * Created by binshan on 2017/11/16.
 * 登出
 */

var checkLogin = require('../../middleware/check').checkLogin;

module.exports = router => {
    router.get('/', checkLogin, signout)
};

// GET /signout 登出
function signout(req, res, next) {
    // res.send(req.flash());
    req.session.user = null;
    req.flash('success','登出成功');
    //登出成功后跳回主页
    res.redirect('/posts');
};
