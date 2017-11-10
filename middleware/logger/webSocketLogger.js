/**
 * Created by Emonice on 2017/11/10.
 */
module.exports = log;

const notify = require('../notification/notification.service');

function log(data) {
    if (!data) return;
    notify.pub({
        type: 'log',
        from: '',
        to: '',
        projectId: null,
        data
    });
}