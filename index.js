var assert = require('assert')

module.exports = Nanobus

function Nanobus () {
  if (!(this instanceof Nanobus)) return new Nanobus()
  this._listeners = {}
  this._pending = 0
  this._subs = {}
}

Nanobus.prototype.on = function (eventName, cb) {
  assert.equal(typeof eventName, 'string', 'nanopubsub.on: eventName should be type string')
  assert.equal(typeof cb, 'function', 'nanopubsub.on: cb should be type function')

  if (!this._listeners[eventName]) this._listeners[eventName] = []
  this._listeners[eventName].push(cb)
}

Nanobus.prototype.pub = function (eventName, data, cb) {
  if (!cb) {
    cb = data
    data = null
  }

  var self = this

  assert.equal(typeof eventName, 'string', 'nanopubsub.pub: eventName should be type string')
  assert.equal(typeof cb, 'function', 'nanopubsub.pub: cb should be type function')

  var subs = this._subs[eventName]
  assert.ok(subs, 'nanopubsub.pub: no subscribers found for ' + eventName)

  var pubListeners = this._listeners.pub
  if (pubListeners) {
    pubListeners.forEach(function (l) {
      l(eventName, data)
    })
  }

  // increment references so we know when to fire the .on('flush') call
  var length = subs.length
  var pending = length
  this._pending += length

  for (var i = 0; i < length; i++) {
    var sub = subs[i]
    sub(data, done)
  }

  function done () {
    if (--pending === 0) cb()
    if (--self._pending === 0) {
      var listeners = self._listeners['flush']
      if (listeners) {
        for (var i = 0, len = listeners.length; i < len; i++) listeners[i]()
      }
    }
  }
}

Nanobus.prototype.sub = function (eventName, cb) {
  assert.equal(typeof eventName, 'string', 'nanopubsub.sub: eventName should be type string')
  assert.equal(typeof cb, 'function', 'nanopubsub.sub: cb should be type function')

  if (!this._subs[eventName]) this._subs[eventName] = []
  this._subs[eventName].push(cb)
}
