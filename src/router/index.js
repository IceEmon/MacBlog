/**
 * Created by Emonice on 2017/11/10.
 */

const path = require('path');
const server = require('../../middleware/webserver/index').server;
const config = require('../../config/config');
const logger = require('../../middleware/logger/log');
const express = require('express');
let app = express();
// const publicPath = config.publicPath;

//#########################博客用到了#############################
// 设置模板目录
app.set('views', path.join(__dirname, 'public/views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');
//#########################博客用到了#############################


server.use('/api', require('./api'));
server.use('/',get);

// 404 page
server.use(function (req, res) {
    if (!res.headersSent) {
        res.status(404).render('404');
    }
});
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
function get(req,res){
    res.redirect('posts')
};
