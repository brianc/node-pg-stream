var pg = require('pg.js')
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
    var host = process.env.PGHOST
    process.env.PGHOST = 'asldkfjaslkdfjsd'
    var stream = pgStream('SELECT * FROM generate_series(1, 100)')
    stream.once('error', function(err) {
      process.env.PGHOST = host
      done()
    })
    stream.read()
  })
})
