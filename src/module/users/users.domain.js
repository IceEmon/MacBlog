/**
 * Created by binshan on 2017/11/12.
 */
const User = require('./schema/user.schema');
const HashPwd = require('../../until/hashPwd');
module.exports = {
    create,
    login,
    getOneUser,
    getUserById,
    validateUser,
    updateSession
}
function create(data){
    if(!data.name || !data.password){
        return {
            error: 'name or password is null'
        }
    }

    data.createdAt = data.createdAt || new Date();
    data.updatedAt = data.updatedAt || new Date();
    data.password = HashPwd(data.password);

    return isExist(data.name)
        .then(exist => {
            if (exist && exist.length) throw {
                code: 2,
                message: 'user exist'
            };
            return User.create(data);
        });
}

function login(data){

}

function isExist(name) {
    return getOneUser({name},projection)
        .then(user => !!user);
}

function getOneUser(data, projection){
    return User.queryOne(data,projection);
}
function getUserById(id, projection) {
    return User.queryById(id, projection);
}

function validateUser(name, password) {

    return getOneUser({name}, 'password')
        .then(user => {
            if (!user) {
                return {
                    error: 'user does not exist'
                }
            }
            if (user.password !== HashPwd(password)) {
                return {
                    error: 'password error'
                }
            }
            return user._id;
        });
}

