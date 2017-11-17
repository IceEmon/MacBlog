
/**
 * Created by Emonice on 2017/11/10.
 */
const path = require('path');

module.exports = {
    app: {
        title: 'Blog',
        version: '1.0.0'
    },
    publicPath: path.join(__dirname, '/../public/views'),
    sessionSecret: 'macBlob',
    aliveInterval: 1000 * 60 * 60,
    queryInterval: 1000 * 60 * 60
};