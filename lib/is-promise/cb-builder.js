const unitMemoryUsage = 1024 * 1024;
const wrapper = require('only-some-times');
module.exports = (self, reject, resolve) => wrapper((error, data) => {
    if (error) return reject(error);
    clearTimeout(self._timerTimeOut);
    self._memoryUsage = process.memoryUsage().heapUsed / unitMemoryUsage;

    if (self.memoryUsageIsOverLimit()) return reject(new Error(`Memory usage ${self._memoryUsageLimit} is over limit`));


    return resolve(data);
});
