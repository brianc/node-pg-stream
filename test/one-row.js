var ok = require('okay')
var pgStream = require('../')

describe('pg-stream', function() {
  it('works', function(done) {
    var stream = pgStream('SELECT NOW()', [])
    stream.on('readable', function() {
      console.log('readable')
      console.log('READ', stream.read(1))
      stream.on('end', done)
    })
  })
})
