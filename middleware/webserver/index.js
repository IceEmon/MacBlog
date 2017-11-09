/**
 * Created by Emonice on 2017/11/9.
 */
module.exports = {
    init(opts){
        const config = require('./config')
        config.mongodbURL = opts.mongodbURL
        config.logger = opts.logger
        config.sessionSecret = opts.sessionSecret
        config.baseName = opts.baseName
        config.publicPath = opts.publicPath
    },
    get server() {
        return require('./server')
    },
    get events() {
        return require('./event')
    }

};