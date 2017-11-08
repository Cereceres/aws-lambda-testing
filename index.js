const Timeout = require('./lib/timeout-class');
const timeOutDefault = 3000;

class awsTest extends Timeout {
    constructor(handler, params, cb, ctx) {
        super();
        this.setHandler(handler);
        this.ctx = ctx || {};
        this.params = params || {};
        this.timeout = timeOutDefault;
        this._init = NaN;
        this._memoryUsageLimit = Infinity
        if (typeof cb === 'function') this._cb = cb;
    }
    getRemainingTimeInMillis() {
        if (!this._init) return this._init;

        return Date.now() - this._init;
    }

}
module.exports = awsTest;
