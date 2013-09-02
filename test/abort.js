var pgStream = require('../')
var assert = require('assert')

describe('abort', function() {
  it('works', function(done) {
    var stream = pgStream('SELECT name FROM test_data ORDER BY name', [])
    stream.once('readable', function() {
      var row = stream.read(1)
      assert.equal(row[0], 'Aaron')
      stream.end(done)
    })
  })
})
