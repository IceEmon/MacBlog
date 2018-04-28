/**
 * Created by Dion on 2017/7/7.
 */

const crypto = require('crypto');

module.exports = password => {
    let shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    return shaSum.digest('hex');
};