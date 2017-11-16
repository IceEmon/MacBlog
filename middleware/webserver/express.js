/**
 * Created by Emonice on 2017/11/9.
 */
const _ = require('lodash');
const Q = require('q');
var path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const sessionStore = require('./sessionStore');
const config = require('./config');
const MAX_BODY = 500 * 1024 * 1024; // 500M
const getIp = require('./getIp')
const morgan = require('morgan');
const helmet = require('helmet');
const zlib = require('zlib');
const msgpack = require('msgpack-lite');
const compression = require('compression');
const logger = config.logger;
const cors = require('cors');//跨域
const p3p = require('p3p');//通过设置P3P头来实现跨域访问COOKIE
const UserAgent = require('./userAgent');
//引入package.json
var pkg = require('../../package');
var flash = require('connect-flash');
let app = express();

/*//#########################博客用到了#############################
// 设置模板目录
app.set('views', path.join(__dirname, 'public/views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');
//#########################博客用到了#############################*/

app.set('trust proxy', true);

//安装Gzip所需要用到的包"compression"
app.use(compression());

app.use(morgan(':ip :method :url :status :response-time ms - :res[content-length] p:pid -- :username :agent', {
    stream: {
        write: message => {
            message = _.trimEnd(message);
            logger.verbose(message);
        }
    }
}));

app.use(bodyParser.json({limit: MAX_BODY}));// content-type: application/json
app.use(bodyParser.urlencoded({extended: true})); // content-type: urlencoded
app.use(bodyParser.raw({limit: MAX_BODY})); // content-type: application/octet-stream
app.use(bodyParser.text()); // content-type: text/plain
app.use(cookieParser());

app.use(session({
    secret: config.sessionSecret,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {maxAge: 3600000 * 24 * 7}, // 7 days
    store: sessionStore
}));

//#########################博客用到了#############################
// flash 中间件，用来显示通知
app.use(flash());
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
    keepExtensions: true// 保留后缀
}));
// 设置模板全局常量
app.locals.blog = {
    title: pkg.name
    // description: pkg.description
};
// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
//#########################博客用到了#############################

app.use(helmet({hsts: false})); // 使用nginx来做，如果使用https，在nginx中做相应的配置
app.disable('x-powered-by');
app.disable('etag');
app.use(express.static(config.publicPath));

//跨域
app.use(cors({
    origin: true,
    credentials: true,
    preflightContinue: true
}));

//通过设置P3P头来实现跨域访问COOKIE
app.use(p3p(p3p.recommended));

//文件图片处理请求头设置
app.use((req, res, next) => {
    req.formData = _.startsWith(req.headers['content-type'], 'multipart/form-data');
    next();
});

app.use((req, res, next) => {
    req.body_empty = body_empty;
    res.send_data = send_data;
    res.send_err = send_err;
    res.send_file = send_file;
    res.send_buf = send_buf;
    res.remove = remove;
    res.send_msgpack = send_msgpack;
    next();

    function send_buf(data) {
        if ('function' !== typeof data.then) {
            res.send(data);
        } else {
            data.then(response => res.send(response))
                .catch(err => {
                    logger.error(err);
                    res.status(400).json(err);
                });
        }
    }

    function send_err(err) {
        logger.error(err);
        res.status(400).json(err);
    }

    function body_empty() {
        if (!req.body) {
            res.status(400).json(new Error('req.body is empty'));
            return true;
        }
        return false;
    }

    function send_data(data) {
        if ('function' !== typeof data.then) {
            res.json(data);
        } else {
            data.then(response => res.json(response))
                .catch(err => {
                    logger.error(err);
                    res.status(400).json(err);
                });
        }
    }

    function send_file(data, options) {
        if ('function' !== typeof data.then) {
            send(data);
            return;
        }

        data.then(send)
            .catch(err => {
                logger.error(err);
                res.status(400).json(err);
            });

        function send(file) {
            res.sendFile(file, options, err => {
                if (err) {
                    logger.error(err);
                    res.status(err.status).end();
                }
            });
        }
    }

    function remove(action) {
        if ('function' !== typeof action.then) {
            res.sendStatus(204);
            return;
        }
        action.then(() => res.sendStatus(204))
            .catch(err => res.status(400).json(err));
    }

    function send_msgpack(data) {
        if ('function' !== typeof data.then) {
            return job(data);
        } else {
            return data.then(job);
        }

        function job(data) {
            return zipBuf(msgpack.encode(data))
                .then(data => res.send(data))
                .catch(err => {
                    logger.error(err);
                    res.status(400).json(err);
                });
        }
    }

    function zipBuf(buf) {
        let acceptEncoding = req.headers['accept-encoding'];
        if (!acceptEncoding) {
            return Q(buf);
        }

        // 优先考虑使用gzip压缩方式，IE bug
        // http://stackoverflow.com/questions/26722478/app-does-not-load-in-internet-explorer/26723126#26723126

        if (acceptEncoding.match(/\bgzip\b/)) {
            res.set({'Content-Encoding': 'gzip'});
            return Q.nfcall(zlib.gzip, buf);
        } else if (acceptEncoding.match(/\bdeflate\b/)) {
            res.set({'Content-Encoding': 'deflate'});
            return Q.nfcall(zlib.deflate, buf);
        } else {
            return Q(buf);
        }
    }
})

morgan.token('pid', () => {
    return `${process.pid}`;
});

morgan.token('ip', req => {
    return getIp(req)
});

morgan.token('username', req => {
    if (!req.session) {
        return '';
    }
    return `${req.session.userName || ''}`;
});

morgan.token('agent', req => {
    let userAgent = new UserAgent(req);
    return `${userAgent.description()}`;
});

module.exports = app;
