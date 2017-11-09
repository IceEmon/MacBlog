/**
 * Created by Emonice on 2017/11/9.
 */
const session = require('express-session');
const sessionStore = require('connect-mongo');
const config = require('./config');

const MongoStore = sessionStore(session);
let store = new MongoStore({
    url: config.mongodbURL
});

module.exports = store;