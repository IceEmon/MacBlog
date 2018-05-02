/**
 * Created by binshan on 2018/4/28.
 */
const User = require('users.domain');
const requestIp = require('request-ip');
const UserAgent = require('./userAgent');

module.exports = router =>{
    router.post('/register', addUser);
    router.post('/login', login);
    router.get('/logout', logout);
    router.get('/logged', logged);
    router.put('/user/:id', updateUser);
    router.delete('/user/:id', deleteUser);
    router.get('/user/:id', getUserById);

}

function addUser(req,res){
    let data = req.body;
    if(!data){
        res.send_err('data is null');
        return;
    }
    let userId = req.session.userId || data.userId;
    if(!userId){
        res.send_err('data is null');
        return;
    }
    data.createdBy = userId;
    data.updatedBy = userId;
    return res.send_data(User.create(data));
}

async function login(req,res){
    let {name, password} = req.body;
    if(!name || password){
        res.send_err('name password is null')
        return;
    }
    let userId = await User.validateUser(name, password);
    let user = await User.getUserById(userId, '_id name');
    await updateSession(user,req);
    res.send_data(user);

    function updateSession(user,req) {
        const userAgent = new UserAgent(req);
        const ip = requestIp.getClientIp(req);
        req.session.name = user.name;
        req.session.userId = user._id.toString();
        req.session.ip = ip;
        req.session.device = userAgent.getDevice();
        req.session.os = userAgent.getOS();
        req.session.agent = userAgent.getAgentString();
        req.session.xhr = !!xhr
    }
}

function logout(req, res) {
    delete req.session.name;
    delete req.session.userId;
    res.status(200).json({message: 'OK'});
}

function logged(req,res){
    let {name, userId} = req.session;
    let info = {
        logged: false,
        user: null
    };

    // _.isNil(xhr): 强制更新session
    if (!name || !userId || _.isNil(xhr)) {
        return new Promise(resolve => resolve(info));
    }

    return User.getUserById(userId)
        .then(async user => {
            info.logged = true;
            info.user = user;
            return info
        });
}

function getUserById(req,res){
    let userId = req.session.userId;
    if(!userId){
        res.send_err('userId of session is null')
        return;
    }
    return res.send_data(User.getUserById(userId))
}

function updateUser(res, req){
    let id = req.params.id;
    if(!id){
        res.send_err('id is null');
        return ;
    }
    let user = req.body;
    if(!user){
        res.send_err('body is null');
    }
    user.updatedBy = req.session.userId || user.userId;
    return res.send_data(User.updateUser);
}

function deleteUser(req, res){
    let id = req.params.id;
    if(!id){
        return res.send_err('id is null')
    }
    res.remove(User.deleteUserById(id))
}

