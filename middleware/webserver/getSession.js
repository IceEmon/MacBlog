/**
 * Created by Emonice on 2017/11/9.
 * 获取session
 */
const sessionStore = require('./sessionStore');

module.exports = id => {
    return new Promise((resolve, reject) => {
        sessionStore.get(id, (err, session) => {
            if (err) reject(err);
            else resolve(session);
        });
    });
}