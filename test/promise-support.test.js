
const assert = require('assert');
const AwsTest = require('../index');
const awsTest = new AwsTest(async (params, ctx) => {
    assert(ctx.getRemainingTimeInMillis() > 27000);
    assert(params.test === 'test');
    assert(typeof ctx.getRemainingTimeInMillis === 'function');
    assert(typeof ctx.done === 'function');
    assert(typeof ctx.fail === 'function');
    assert(typeof ctx.succeed === 'function');
    return 'test'
});
awsTest.setTimeout(30000);

describe('The test to aws-tester with promise', () => {
    before(() => {
        awsTest._cb = null;
        awsTest.setHandler((params, ctx) => {
            assert(params.test === 'test');
            ctx.done(null, 'test');
        });
    });
    it('should throw a error if handler is not a function', () => {
        try {
            awsTest.setHandler();
        } catch (err) {
            assert(err);
        }
    });

    it('should return a promise reject when the handler is not given', () => new AwsTest()
        .exec()
        .catch((err) => {
            assert(err);
        })
    );


    it('should exec the promise passed', () => awsTest
        .exec({ test: 'test' })
        .then((res) => {
            assert(res === 'test');
        })
        .catch((err) => Promise.reject(err))
    );

    it('The test for the promise with cb', () => awsTest
        .setHandler((params, ctx, cb) => {
            assert(params.test === 'test');
            cb(null, 'test');
        })
        .exec({ test: 'test' })
        .then((res) => {
            assert(res === 'test');
        }));

    it('The test for the promise with success', () => awsTest
        .setHandler((params, ctx) => ctx.succeed('test'))
        .exec(null)
        .then((res) => {
            assert(res);
        }));

    it('The test for the promise with done', () => awsTest
        .setHandler((params, ctx) => ctx.done(null, 'test'))
        .exec(null)
        .then((res) => assert(res)));

    it('The test for the promise with fail', () => awsTest
        .setHandler((params, ctx) => ctx.fail('error'))
        .exec(null)
        .catch((error) => assert(error)));

    it('the error is catched by the promise', () => awsTest
        .setHandler((params, ctx, promise) => {
            promise(null, 'data');
        })
        .exec(null)
        .then((res) => {
            assert(res === 'data');
        }));

    it('shoudl call the getRemainingTimeInMillis function', () => awsTest
        .setHandler((params, ctx, cb) => {
            assert.equal(typeof ctx.getRemainingTimeInMillis, 'function');
            cb(null, 'data');
        })
        .exec(null)
        .then((res) => {
            assert.equal(res, 'data');
        }));

    it('the error is catched when fail is used', () => awsTest
        .setHandler((params, ctx) => ctx.fail('error'))
        .exec(null)
        .catch((err) => assert(err)));
    it('the error is catched when the timeout is broken', () => awsTest
        .setHandler((params, ctx) => setTimeout(() => ctx.fail(), 50))
        .setTimeout(40)
        .exec(null)
        .catch((err) => {
            assert(err.message === 'timeout 40 broken')

        }));
});

