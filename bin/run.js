/**
 * Created by Emonice on 2017/11/9.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const config = require('../config/config');
const app = require('../src/app');

let port = config.port;
if (process.argv.length >= 3) {
    port = process.argv[2] || port;
}
app(port);