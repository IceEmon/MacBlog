/**
 * Created by Emonice on 2017/11/10.
 */
function Notification() {
    this.eventHandlers = {};
    this.client = null;
    this.channel = null;
}
module.exports = new Notification();

const _ = require('lodash');
const async = require('async-q');
const mubsub = require('mubsub');
const mongo = require('../mongo');
const repo = require('../repo');
const NotificationSchema = require('./notification.schema');
const logger = require('../logger/log');
const ObjectId = require('mongoose').Types.ObjectId;

// public methods
Notification.prototype.init = function (options) {
    this.client = mubsub(mongo.getConnectionURL(), options || {});
    this.channel = this.client.channel('notification-service');
    this.client.on('error', err => {
        logger.error(`mubsub client error ${err}`)
    });
    this.channel.on('error', err => {
        logger.error(`mubsub channel error ${err}`)
    });
    this.channel.subscribe('notify', message => {
        if (!message) {
            return;
        }
        try {
            message = JSON.parse(message);
            let type = message.type;
            let handlers = this.eventHandlers[type];
            if (!handlers) return;
            handlers.forEach(handler => handler(message));
        } catch (err) {
            logger.error(`channel.subscribe ${err}`);
        }
    });
};

Notification.prototype.close = function () {
    this.client && this.client.close()
};

Notification.prototype.sub = function (type, handler) {
    let handlers = this.eventHandlers[type];
    if (!handlers) {
        handlers = [handler];
        this.eventHandlers[type] = handlers;
        return;
    }

    let find = handlers.find(handler);
    if (!find) {
        handlers.push(handler);
    }
};

Notification.prototype.pub = function (message) {
    if (!message) return;
    if (!this.channel) return;
    let channel = this.channel;
    if (!message.projectId) message.projectId = null;
    message.date = message.date || new Date();
    if (!message.to) message.to = null;
    if (!message.from) message.from = null;
    if (ObjectId.isValid(message.data)) { // 老版本通知
        publish(message);
    } else {
        if (message.from && message.to && message.from.toString() === message.to.toString()) return;
        if (message.type === 'log' ||
            message.type === 'material_created' ||
            message.type === 'op-record') {
            publish(message);
        } else {
            repo.add(NotificationSchema, message).then(publish);
        }
    }

    function publish(message) {
        message = JSON.stringify(message);
        channel.publish('notify', message);
    }
};

Notification.prototype.receipt = function (ids) {
    return async.each(ids, __update);

    function __update(_id) {
        return repo.updateById(NotificationSchema, _id, {handledDate: new Date()});
    }
};

Notification.prototype.getUnHandledByUserId = function (userId) {
    return repo.query(NotificationSchema, {
        to: userId,
        handledDate: null
    });
};

Notification.prototype.applyFilter = function (filter) {
    return repo.applyFilter(NotificationSchema, filter);
};

Notification.prototype.updateMulti = function (where = {}, data = {}) {
    if (_.isEmpty(where)) return;
    return repo.updateMulti(NotificationSchema, where, data, true);
};

Notification.prototype.getCount = function (where = {}) {
    return repo.getCount(NotificationSchema, where);
};