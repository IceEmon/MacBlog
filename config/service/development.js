/**
 * Created by Emonice on 2017/11/9.
 */
/*module.exports = {
    port : 3000, //程序启动要监听的端口号
    session : {     //express-session 的配置信息
        secret : 'macBlog',
        key : 'macBlog',
        maxAge : 2592000000
    },
    mongodb: 'mongodb://localhost:27017/macBlog'   //mongodb 的地址

}*/
module.exports = {
    port: process.env.PORT || 3001, //程序启动要监听的端口号
    // baseName: 'http://180.168.170.198:3010',
    mongodb: {
        host: 'localhost',
        port: 27017,
        name: 'macBlog',
        // user: 'blog',
        // password: 'blog123',
        // replicaSet: [],
        // setName: 'blog',
        driverOptions: {
            poolSize: 100,
            reconnectTries: Number.MAX_VALUE,
            connectTimeoutMS: 120000,
            socketTimeoutMS: 240000
        }
    },
    jspush: {
        bomPhone: {
            appKey: 'a6ed1fade1c79ca7dd3583eb',
            masterSecret: '98cbed5b056e6b770c8fb332'
        }
    }
}