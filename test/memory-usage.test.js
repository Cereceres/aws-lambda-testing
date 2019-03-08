
const assert = require('assert');
const AwsTest = require('../index');
const awsTest = new AwsTest((params, ctx, cb) => {
    assert(ctx.getRemainingTimeInMillis() > 27000);
    assert(params.test === 'test');
    assert(typeof ctx.getRemainingTimeInMillis === 'function');
    assert(typeof ctx.done === 'function');
    assert(typeof ctx.fail === 'function');
    assert(typeof ctx.succeed === 'function');
    assert(typeof cb === 'function');
    ctx.done(null, 'test');
});
awsTest.setTimeout(30000);


describe('test memory usage', () => {
    it('should return the memory usage', async () => {
        await awsTest
            .setHandler((params, ctx) => ctx.done(null, params))
            .exec({});
        assert(awsTest.getMemoryUsage() > 0);
    });

    it('should throw a erros if memory usage is over limit', async () => {
        awsTest.setMemoryUsageLimit(0.1);
        awsTest.setTimeout(10000);
        const { error } = await awsTest.setHandler((params, ctx) => {
            const data = [];
            for (let i = 0; i < 100000; i++) data.push(i);
            data.reverse();
            ctx.done();
        })
            .exec({})
            .catch((error) => ({ error }));
        assert(error.message === 'Memory usage 0.1 is over limit');
    });
});
