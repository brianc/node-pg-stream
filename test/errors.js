var pgStream = require('../')
var assert = require('assert')

describe('errors', function() {
  it('emits error event on query', function(done) {
    var stream = pgStream('SELECT bla FROM bla-dee-blah FLA FLA!!!')
    stream.read()
    stream.on('error', function(err) {
      assert(err.code)
      done()
    })
  })

  it('emits error event on connection error', function(done) {
    var Connection = require('pg.js').Connection()
    var con = new Connection({user: 'blah', password: 'popeye ate spinach'})
    var stream = 
  })
})
