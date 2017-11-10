/**
 * Created by Emonice on 2017/11/10.
 */
module.exports = {
    error,
    warn,
    info,
    verbose,
    debug,
    log
};

const Q = require('q');
const winston = require('winston');
const mongoDBLogger = require('./mongoDBLogger');
const webSocketLogger = require('./webSocketLogger');

const logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            handleExceptions: true,
            json: false,
            colorize: true,
            level: 'silly'
        })
    ]
});

function error(msg, metadata) {
    log('error', msg, metadata);
}

function warn(msg, metadata) {
    log('warn', msg, metadata);
}

function info(msg, metadata) {
    log('info', msg, metadata);
}

function verbose(msg, metadata) {
    log('verbose', msg, metadata);
}

function debug(msg, metadata) {
    log('debug', msg, metadata);
}

function log(level, msg, meta) {
    if (meta) {
        logger.log(level, msg, meta);
    } else {
        logger.log(level, msg);
    }
    let data = {
        level,
        msg,
        meta,
        device: 'server'
    };
    return Q.allSettled([
        mongoDBLogger(data),
        webSocketLogger(data)
    ])
        .catch(console.error);
}