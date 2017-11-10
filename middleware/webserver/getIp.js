/**
 * Created by Emonice on 2017/11/9.
 * 获取客户端Ip
 */
const requestIp = require('request-ip')

module.exports = req => requestIp.getClientIp(req)