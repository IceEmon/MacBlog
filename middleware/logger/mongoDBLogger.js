/**
 * Created by Emonice on 2017/11/10.
 */
module.exports = log;

const repo = require('../repo');
const LogSchema = require('./log.schema');

function log(data) {
    data.createdAt = data.createdAt || new Date();
    return repo.add(LogSchema, data);
}