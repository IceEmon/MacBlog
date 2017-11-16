/**
 * Created by Emonice on 2017/11/10.
 */
const _ = require('lodash');
const webServer = require('../../middleware/webserver/index').server;
const router = webServer.router();

router.use('/v1', router);
router.use('/v2', router);
require('./touch')(router);
require('./signin')(router);
require('./signup')(router);
require('./posts')(router);

module.exports = router;
