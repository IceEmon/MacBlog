/**
 * Created by Emonice on 2017/11/9.
 */
const _ = require('lodash');

process.env.NODE_ENV = process.env.NODE_ENV || require('./env');

/**
 * Load app configurations
 */
module.exports = _.extend(
    require('./all'),
    require('./service/' + process.env.NODE_ENV)
);