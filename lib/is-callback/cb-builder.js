const unitMemoryUsage = 1024 * 1024;
const wrapper = require('only-some-times');
module.exports = (self) => wrapper((error, data) => {
    if (error) return self._cb.call(self.ctx, error, null);

    self._memoryUsage = process.memoryUsage().heapUsed / unitMemoryUsage;
    clearTimeout(self._timerTimeOut);

    if (self.memoryUsageIsOverLimit()) return self._cb.call(self.ctx, new Error(`Memory usage ${self._memoryUsageLimit} is over limit`));

    self._cb.call(self.ctx, null, data);
});
