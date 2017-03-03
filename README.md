# nanobus [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Tiny message bus.

## Usage
```js
var nanobus = require('nanobus')
var bus = nanobus()

bus.on('flush', function () {
  console.log('all events done!')
})

bus.sub('beep:boop', function (data, done) {
  console.log('boop was called')
  done()
})

bus.pub('beep:boop', function () {
  console.log('calling beep:boop done!')
})
```

## FAQ
### How do I handle errors?
Emit an event like you'd do with everything else. There is no need for global
error handling because it can be implemented by consumers.

### How do I publish from a subscriber?
You can call `bus.pub` from inside `bus.sub` - wait with calling `done()` until
the `bus.pub` call has resolved to guarantee the right ordering of events.

### How do I namespace events?
This is done through convention. We recommend namespacing events using the `:`
separator (e.g. `bus.sub('foo:bar')`).

## API
### `bus = nanobus()`
Create a new message bus.

### `bus.sub(eventName, callback(data, done))`
Create a new subscriber for an event. `done()` should be called when the
subscriber is done.

### `bus.pub(eventName, [data], callback)`
Emit a new event with optional data attacked. The callback is called once all
handlers are done.

### `bus.on(eventName, callback)`
Listen to global events on the message bus. There are a few events available:
- `bus.on('flush')`: called when all `bus.pub` calls have resolved.
- `bus.on('pub')`: called every time a `bus.pub` call is fired. `eventName`
  and `data` are passed to the callback.

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/nanobus.svg?style=flat-square
[3]: https://npmjs.org/package/nanobus
[4]: https://img.shields.io/travis/yoshuawuyts/nanobus/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/nanobus
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/nanobus/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/nanobus
[8]: http://img.shields.io/npm/dm/nanobus.svg?style=flat-square
[9]: https://npmjs.org/package/nanobus
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
