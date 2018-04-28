/**
 * Created by binshan on 2018/4/28.
 */
const User = require('users.domain');
const requestIp = require('request-ip');
const UserAgent = require('./userAgent');

module.exports = router =>{
    router.post('/user', addUser);
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

}

function getUserById(req,res){
    let userId = req.session.userId;
    if(!userId){
        res.send_err('userId of session is null')
        return;
    }
    return res.send_data(User.getUserById(userId))
}

