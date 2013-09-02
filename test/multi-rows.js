var ok = require('okay')
var pgStream = require('../')

describe('pg-stream', function() {
  it('can read multiple rows', function(done) {
    var stream = pgStream('SELECT * FROM test_data LIMIT 3', [])
    stream.rows(10)
    var n = 0;
    stream.on('readable', function() {
      console.log('READ', stream.read(100))
      if(n++ >= 2) {
        done()
      }
    })
  })
})
