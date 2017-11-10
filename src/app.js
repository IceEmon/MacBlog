/**
 * Created by Emonice on 2017/11/9.
 */
const  _ = require('lodash');
const mongo = require('../middleware/mongo');
const config = require('../config/config');
const weberver = require('../middleware/webserver/index');
const logger = require('../middleware/logger/log');
const notification = require('../middleware/notification/notification.service');

module.exports = port=> {
    mongo.init(config);
    weberver.init(_.extend({
        mongodbURL: mongo.getConnectionURL(),
        logger: logger
    }, config));

    return weberver.server.listen(port)
        .then(()=>{
            logger.info(`=> start MongoDB service, ${mongo.getConnectionURL()}`);
            return mongo.connect();
        })
        .then(() => {
            // logger.info(`=> start notification service`);
            // notification.init(config.mongodb.driverOptions);
            // logger.info(`=> start job queue service`);
            // jobQueue.init(config.mongodb.driverOptions);
            // logger.info(`=> start jsPush service`);
            // jsPush.init(config);
            // logger.info(`=> start alive service`);
            // Server.init();
            // logger.info(`=> require events`);
            require('./events');
            logger.info(`=> require routers`);
            require('./router');
            logger.info(`=> app start on port ${port} with ${process.env.NODE_ENV} environment`);
        })
        .catch(err => logger.error(`app failed with error: ${err}`));
};