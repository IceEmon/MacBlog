/**
 * Created by Emonice on 2017/11/9.
 */
const  _ = require('lodash');
const mongo = require('../middleware/mongo');
const config = require('../config/config');
const weberver = require('../middleware/webserver/index');

module.exports = port=> {
    mongo.init(port);
    weberver.init(_.extend({
        mongodbURL: mongo.getConnectionURL(),
        logger: logger
    }, config));
};