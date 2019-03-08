const Timeout = require('./lib/timeout-class');
const timeOutDefault = 3000;
const AWS = require('aws-sdk');
const defaultName = 'AWS_LAMBDA_TESTING';
const _sts = new AWS.STS();
const defaultMemoryUsageLimit = 128
class awsTest extends Timeout {
    constructor(handler, params, cb, ctx) {
        super();
        if (handler) this.setHandler(handler);
        this.ctx = ctx || {};
        this.params = params || {};
        this.timeout = timeOutDefault;
        this._init = NaN;
        this._memoryUsageLimit = defaultMemoryUsageLimit;
        if (typeof cb === 'function') this._cb = cb;
    }
    getRemainingTimeInMillis() {
        if (!this._init) return this._init;

        return this._init - Date.now();
    }

    static assumeRole(RoleArn, RoleSessionName = defaultName, sts = _sts) {
        const params = {
            RoleArn,
            RoleSessionName,
            DurationSeconds: 300
        };
        return sts.assumeRole(params).promise()
            .then((res) => {
                const { AccessKeyId, SecretAccessKey, SessionToken } = res;
                process.env.AWS_ACCESS_KEY_ID = AccessKeyId;
                process.env.AWS_SECRET_ACCESS_KEY = SecretAccessKey;
                process.env.AWS_SESSION_TOKEN = SessionToken;

                return res;
            });
    }
}
module.exports = awsTest;
