/**
 * Created by Emonice on 2017/11/9.
 *
 */
const mongoose = require('mongoose');
const logger = require('./logger/log')
let config = null;
module.exports = {
    init,
    getConnectionURL,
    connect
};

function init(__config){
    config = __config
    mongoose.connection.on('error', error => {
        logger.error(`mongoose connection *error* ${error}`)
    })
    mongoose.connection.on('connecting', () => {
        logger.info(`mongoose connection *connecting*`)
    })
    mongoose.connection.on('reconnected', () => {
        logger.info(`mongoose connection *reconnected*`)
    })
    mongoose.connection.on('fullsetup', () => {
        logger.info(`mongoose connection *fullsetup*`)
    })
    mongoose.connection.on('all', () => {
        logger.info(`mongoose connection *all*`)
    })
}

function getConnectionURL(){
    if (!config) throw 'mongodb config is nil'

    const conf = config.mongodb
    if (!conf) throw 'parse mongodb options error'

    let url = 'mongodb://'
    if (conf.user && conf.password) {
        url += `${conf.user}:${conf.password}@`
    }
    url += conf.host + ':' + conf.port
    const replica = conf.replicaSet
    if (replica) {
        replica.forEach(item => url += `,${item.host}:${item.port}`)
    }
    //模板字符串
    url += `/${conf.name}`
    if (replica && replica.length) {
        url += `?replicaSet=${conf.setName}`
    }
    return url
}
function connect() {
    const url = getConnectionURL()
    const options = config.mongodb.driverOptions || {}
    return mongoose.connect(url, {server: options})
}
