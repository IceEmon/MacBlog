/**
 * Created by Emonice on 2017/11/9.
 * 添加事件
 */
class EventHandler {
    constructor() {
        this.events = {};
    }

    on(event, handler) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(handler);
    }

    pub(event, data) {
        let handlers = this.events[event];
        if (handlers && handlers.length) {
            handlers.forEach(handler => handler(data));
        }
    }
}

let eventHandler = new EventHandler();
module.exports = eventHandler;
// module.exports = EventHandler;