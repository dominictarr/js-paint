var h = require('h')
var elstreamo = require('el-streamo')
var timestamp = require('monotonic-timestamp')
var reconnect = require('reconnect')
var reloader = require('client-reloader')

var model = require('./model')()

var canvas = CANVAS = h('canvas', {width: 600, height: 400})
var c = CXT = canvas.getContext('2d')
var picker = h('input', {type: 'color', change: function (e) {
  color = this.value
}})

var down = false, color = 'black', _x, _y

model.on('line', function line (_x, _y, x, y, l) {
  c.beginPath()
  c.setStrokeColor(l || 'black')
  c.moveTo(_x, _y)
  c.lineTo(x, y)
  c.stroke()
})


document.body.appendChild(canvas)
document.body.appendChild(picker)

elstreamo.readable(canvas, {
  mousedown: function (e) {
    down = true
    _x = e.offsetX, _y = e.offsetY
  },
  mouseup: function () {
    down = false
  },
  mouseout: function () {
    down = false
  },
  mousemove: function onMove (e) {
    if(!down) return
    var data = {}
    var x = e.offsetX
    var y = e.offsetY
    data[x+':'+y] = {x: x, y: y, _x: _x, _y: _y, c: color, t: timestamp()}
    //actually, want to add in between pixels...

    this.queue(data)
    _x = x; _y = y
  }
}).on('data', model.update)

console.log(canvas)

var r = reconnect({ maxDelay: 5e3 }, reloader(function (stream) {
  stream.pipe(model.createStream()).pipe(stream)
})).connect('/shoe')

//show current connection status
document.body.appendChild(r.widget())

model.on('update', function () {
  localStorage['js-paint'] = JSON.stringify(model.collection)
})

try {
  model.update(JSON.parse(localStorage['js-paint']))
} catch (_) {console.log(_)}

