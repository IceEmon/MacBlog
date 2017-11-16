/**
 * Created by binshan on 2017/11/12.
 */
const UserSchema = require('./schema/user.schema');
const repo = require('../../../middleware/repo')
module.exports = {
    create,
    getUserByName
}
function create(data){
    return repo.add(UserSchema,data);
}
function getUserByName(name){
    return repo.queryOne(UserSchema,name);
}


