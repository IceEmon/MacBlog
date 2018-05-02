/**
 * Created by binshan on 2018/4/28.
 */

const repo = require('./repo')
const _ = require('lodash')

module.exports = Schema => {
    let repoObj = {Schema}
    _.forEach(_.keysIn(repo), key => repoObj[key] = _.partial(repo[key], Schema))
    return repoObj
}
