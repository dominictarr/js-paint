
var repred    = require('repred')
var timestamp = require('monotonic-timestamp')

module.exports = function () {
  var model = repred(function (col, stroke) {
    var changes = {}
    for (var k in stroke) {
      var pair = k.split(':')

      //there is a strange error in here...
      if(pair.length != 2) return

      var x = pair[0], y = pair[1]
      if(!col[k] || col[k].t < stroke[k].t) {
        var c = changes[k] = col[k] = stroke[k]
        model.emit('line', c._x, c._y, c.x, c.y, c.c)
      }
    }
    return changes
  }, {})

  return model
}
