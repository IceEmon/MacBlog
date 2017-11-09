/**
 * Created by Emonice on 2017/11/9.
 */
const useragent = require('useragent')

class UserAgent {
    constructor(req) {
        this.req = req;
        this.ua = useragent.is(req.headers['user-agent']);
        this.agent = useragent.parse(req.headers['user-agent']);
    }

    getOS() {
        return this.agent.os.family;
    }

    getDevice() {
        return this.agent.device.family;
    }

    getAgentString() {
        let ua = this.ua;
        if (ua.webkit) {
            return 'webkit';
        }
        if (ua.opera) {
            return 'opear';
        }
        if (ua.ie) {
            return 'ie';
        }
        if (ua.chrome) {
            return 'chrome';
        }
        if (ua.safari) {
            return 'safari';
        }
        if (ua.mobile_safari) {
            return 'mobile_safari';
        }
        if (ua.firefox) {
            return 'firefox';
        }
        if (ua.mozilla) {
            return 'mozilla';
        }
        if (ua.android) {
            return 'android';
        }
        return 'unknown';
    }

    description() {
        return `${this.getAgentString()}_${this.getOS()}_${this.getDevice()}`;
    }
}

module.exports = UserAgent;