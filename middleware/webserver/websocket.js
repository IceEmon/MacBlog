/**
 * Created by Emonice on 2017/11/9.
 * 封装 websocket 端接口
 */
// 封装 websocket 端接口，使用socket.io实现
// 1. 接收来自用户的消息（登录，注销等）
// 2. 接收系统的消息，发送给相应的用户
// 消息的格式遵从 notification schema, 所有组件都知道怎么解释各个字段值

const _ = require('lodash');
const cookie = require('cookie');
const signature = require('cookie-signature');
const debug = require('debug')('websocket');
const config = require('./config');
const sessionStore = require('./sessionStore');
const logger = require('./config').logger;
const UserAgent = require('./userAgent');
const event = require('./event');
const getSession = require('./getSession')
const getIp = require('./getIp')

let io = require('socket.io')();

module.exports = {
    init,
    getSockets
};

function init(server){
    if (!server) return;
    io.attach(server, {transports: ['websocket', 'polling']});
    io.on('connection', connection);
    io.on('message', message => logger.info(`websocket#message: ${message}`));
    io.on('anything', data => logger.info(`websocket#anything ${data}`));
}

function connection(socket) {
    socket.on('notification', notification => {
        if (!notification) return
        const type = notification.type;
        if (type === 'log') {
            socket.data = socket.data || {};
            if (socket.data.log) {
                delete socket.data.log
            } else {
                socket.data.log = notification.data
            }
        }
        if (type === 'op-record') {
            socket.data = socket.data || {};
            if (socket.data.oprecord) {
                delete socket.data.oprecord
            } else {
                socket.data.oprecord = true
            }
        }
        event.pub('message', notification);
    });

    socket.on('disconnect', () => {
        if (!socket.data || !socket.data.userId || !socket.data.userName) {
            return;
        }
        const ip = socket.data.ip
        const user = socket.data.userName
        logger.verbose(`${ip} websocket disconnect -- ${user}`);
        event.pub('disconnect', socket.data);
    });

    const userAgent = new UserAgent(socket.request);
    const sessionId = getSessionId(socket.request);
    const ip = getIp(socket.request);

    getSession(sessionId)
        .then(sess => {
            socket.data = {
                sessionId,
                ip: sess.ip || ip,
                pid: process.pid,
                metadata: {
                    device: sess.device || userAgent.getDevice(),
                    os: sess.os || userAgent.getOS(),
                    agent: sess.agent || userAgent.getAgentString(),
                    xhr: !!sess.xhr
                }
            }

            if (!sess || !sess.userId || !sess.userName) {
                return
            }

            socket.data = _.extend(socket.data, {
                userId: sess.userId || '',
                userName: sess.userName || ''
            });
            logger.verbose(`${ip} websocket connect -- ${socket.data.userName || ''} ${userAgent.description()}`);
            event.pub('connect', socket.data);
        })
}

function getSockets() {
    return _.values(io.sockets.sockets);
}

function getSessionId(req) {
    let header = req.headers.cookie;
    let raw;
    let val;

    // read from cookie header
    if (header) {
        let cookies = cookie.parse(header);

        raw = cookies['connect.sid'];

        if (raw) {
            if (raw.substr(0, 2) === 's:') {
                val = unsigncookie(raw.slice(2), [config.sessionSecret]);

                if (val === false) {
                    debug('cookie signature invalid');
                    val = undefined;
                }
            } else {
                debug('cookie unsigned')
            }
        }
    }
    return val;

    function unsigncookie(val, secrets) {
        for (let i = 0; i < secrets.length; i++) {
            let result = signature.unsign(val, secrets[i]);

            if (result !== false) {
                return result;
            }
        }
        return false;
    }
}