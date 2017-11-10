/**
 * Created by Emonice on 2017/11/10.
 */

const path = require('path');
const server = require('../../middleware/webserver/index').server;
const config = require('../../config/config');
const logger = require('../../middleware/logger/log');
// const publicPath = config.publicPath;

server.use('/api', require('./api'));

/// catch 404 and forward to error handler
server.use(function (req, res, next) {
    let err = new Error('Not Found');
    logger.error(`404: ${err}`);
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
server.use(function (err, req, res, next) {
    logger.error(`500: ${err}`);
    res.status(err.status || 500);
    res.json(err);
});