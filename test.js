'use strict'
const assert = require('assert')
let AwsTest = require('./index')
let called
let awsTest = new AwsTest(function (params, ctx, cb) {
  assert(params.test === 'test')
  ctx.done(null, 'test')
})
let i = 0
describe('The test to aws-tester', function () {
  it('The test for the callback', function (done) {
    let called
    awsTest.exec({test: 'test'}, function (error, res) {
      assert(!error)
      called = true
      assert(res === 'test')
    })
    .then(function (res) {
      if(called) done()
    })
    .catch(done)
  })

  it('The test for the callback with cb', function (done) {
    let called
    awsTest
    .addHandler(function (params, ctx, cb) {
      assert(params.test === 'test')
      cb(null, 'test')
    })
    .exec({test: 'test'}, function (error, res) {
      assert(!error)
      called = true
      assert(res === 'test')
    })
    .then(function (res) {
      if(called) done()
    })
    .catch(done)
  })

  it('The test for the callback with success', function (done) {
    let called
    awsTest
    .addHandler(function (params, ctx, cb) {
      cb(null, 'test')
    })
    .exec(function (error, res) {
      called = true
    })
    .then(function (res) {
      if(called) done()
    })
  })

  it('the error is catched by the promise', function (done) {
    awsTest
    .addHandler(function (params, ctx, callback) {
      callback(null, 'data')
    })
    .exec(function (error, res) {
      ++i
      assert(res === 'data')
    }).then(function (res) {
      assert(i === 1)
      done()
    })
    .catch(done)
  })
  it('the error is catched by the promise if is throw', function (done) {
    awsTest
    .addHandler(function (params, ctx, callback) {
      callback(null, 'data')
    })
    .exec(function () {
      throw new Error('test of error')
    })
    .catch(function (error) {
      assert(error.message === 'test of error')
      done()
    })
  })

  it('the error is catched when fail is used', function (done) {
    let called = false
    awsTest
    .addHandler(function (params, ctx, callback) {
      ctx.fail('error')
    })
    .exec(function (err) {
      called = true
      assert(err)
      done()
    })
  })

  it('the error is throw when timeout is broken', function (done) {
    awsTest
    .addHandler(function (params, ctx, callback) {
      let timeout = setTimeout(function () {
        clearTimeout(timeout)
        callback(null,{})
      }, 2000);
    })
    .exec(function (err) {
      assert(err)
      done()
    })
  })

  it('should change the time out', function (done) {
    awsTest
    .timeout(4000)
    .addHandler(function (params, ctx, callback) {
      let timeout = setTimeout(function () {
        callback(null,{})
      }, 5000);
    })
    .exec(function (err) {
      assert(err)
      done()
    })
  })
})
