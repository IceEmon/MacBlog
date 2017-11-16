/**
 * Created by binshan on 2017/11/12.
 * 检验是否登录
 */
module.exports = {
    checkLogin,
    checkNotLogin
}
function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error','未登录');
        return res.redirect('/singin')
    }
    next();
}
function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('error','已登录');
        return res.redirect('back');//返回之前的页面
    }
    next();
}
