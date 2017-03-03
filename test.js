var tape = require('tape')
var nanobus = require('./')

tape('nanobus', function (t) {
  t.test('should assert input types', function (t) {
    t.plan(6)
    var bus = nanobus()
    t.throws(bus.pub.bind(bus), /string/)
    t.throws(bus.pub.bind(bus, 'message', 123), /function/)
    t.throws(bus.sub.bind(bus), /string/)
    t.throws(bus.sub.bind(bus, 'message', 123), /function/)
    t.throws(bus.on.bind(bus), /string/)
    t.throws(bus.on.bind(bus, 'message', 123), /function/)
  })

  t.test('should emit messages', function (t) {
    t.plan(4)
    var bus = nanobus()
    var obj = { bin: 'baz' }
    bus.sub('foo:bar', function (data, done) {
      t.equal(data, obj, 'data was same')
      done()
    })

    bus.pub('foo:bar', obj, function () {
      t.pass('publish done')
    })

    bus.sub('beep:boop', function (data, done) {
      t.equal(data, null)
      done()
    })

    bus.pub('beep:boop', function () {
      t.pass('second publish done')
    })
  })

  t.test('should emit a flush event when all events are flushed', function (t) {
    t.plan(6)
    var bus = nanobus()
    var i = 0

    bus.sub('beep:boop', function (data, done) {
      t.equal(i++, 2, 'number 2')
      done()
    })

    bus.sub('foo:bar', function (data, done) {
      t.equal(i++, 1, 'number 1')
      bus.pub('beep:boop', function () {
        t.equal(i++, 3, 'number 3')
        done()
      })
    })

    bus.on('flush', function () {
      t.equal(i, 5, 'number 5')
    })

    t.equal(i++, 0, 'number 0')
    bus.pub('foo:bar', function () {
      t.equal(i++, 4, 'number 4')
    })
  })

  t.test('should emit a pub event when an event is published', function (t) {
    t.plan(2)
    var bus = nanobus()
    var i = 0
    var j = 0

    bus.sub('beep:boop', function (data, done) {
      i++
      done()
    })

    bus.sub('foo:bar', function (data, done) {
      i++
      bus.pub('beep:boop', function () {
        i++
        done()
      })
    })

    bus.on('pub', function () {
      switch (j++) {
        case (0): return t.equal(i, 0, 'one called')
        case (1): return t.equal(i, 1, 'one called')
      }
    })

    bus.pub('foo:bar', function () {
      i++
    })
  })
})
