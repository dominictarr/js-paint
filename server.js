
var shoe     = require('shoe')
var ecstatic = require('ecstatic')
var http     = require('http')
var join     = require('path').join
var reloader = require('client-reloader')
var opts     = require('optimist').argv

var PORT = 3000

var model = require('./model')()

shoe(reloader(function (stream) {
  console.log('connection')
  stream.pipe(model.createStream()).pipe(stream)

  stream.pipe(process.stderr, {end: false})
}, opts.version)).install(http.createServer(
  ecstatic(join(__dirname, 'static'))
).listen(PORT, function () {
  console.log( 'listening on', PORT)
}), '/shoe')

