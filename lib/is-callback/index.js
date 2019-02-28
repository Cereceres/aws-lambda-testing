const getContext = require('./get-context');
const cbBuilder = require('./cb-builder');
const eventBrokenDefault = 'timeoutBroken';
const {
    EVENT_TIMEOUT: eventTimeOutBrokenName = eventBrokenDefault
} = process.env;

module.exports = (self) => {
    const cb = cbBuilder(self);
    const ctx = getContext(self, cb);
    self.once(eventTimeOutBrokenName, () => cb(new Error(`timeout broken: ${self.timeout}`)));
    try {
        const response = self.handler.call(self.ctx, self.params, ctx, cb);

        if (response instanceof Promise) return response
            .then(res => cb(null, res))
            .catch(cb)
        return self;
    } catch (e) {
        cb(e);
        return self;
    }
};


