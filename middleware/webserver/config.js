/**
 * Created by Emonice on 2017/11/9.
 */
let db_url = ''
let logger_ = console
let session_secret = 'macBlob'
let base_name = ''
let public_path = ''

module.exports = {

    set mongodbURL(url) {
        db_url = url
    },

    get mongodbURL() {
        return db_url
    },

    set logger(callback) {
        logger_ = callback
    },

    get logger() {
        return logger_
    },

    set sessionSecret(secret) {
        session_secret = secret
    },

    get sessionSecret() {
        return session_secret
    },

    set baseName(name) {
        base_name = name
    },

    get baseName() {
        return base_name
    },

    set publicPath(path) {
        public_path = path
    },

    get publicPath() {
        return public_path
    }
}