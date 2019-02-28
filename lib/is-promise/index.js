const getContext = require('./get-context');
const cbBuilder = require('./cb-builder');

const eventBrokenDefault = 'timeoutBroken';
const {
    EVENT_TIMEOUT: eventTimeOutBrokenName = eventBrokenDefault
} = process.env;
module.exports = (self) => new Promise((resolve, reject) => {
    const cb = cbBuilder(self, reject, resolve);
    const ctx = getContext(self, cb);
    self.once(eventTimeOutBrokenName, () => cb(new Error(`timeout ${self.timeout} broken`)));
    try {
        const response = self.handler.call(self.ctx, self.params, ctx, cb);

        if (response instanceof Promise) return response
            .then(res => cb(null, res))
            .catch(cb)
        return response
    } catch (error) {
        reject(error);
    }
});

