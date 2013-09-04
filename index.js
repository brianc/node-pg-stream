var pg = require('pg.js')
var util = require('util')
var Readable = require('stream').Readable

var QueryStream = function(connection, text, values) {
  this._con = connection
  this._text = text
  this._values = values
  this._initialized = false
  Readable.call(this, { objectMode: true, highWaterMark: 1 })
}
util.inherits(QueryStream, Readable)

var query = function(text, values, cb) {
  var connection = new pg.Connection()
  return new QueryStream(connection, text, values)
}

module.exports = query
query.Stream = QueryStream;

QueryStream.prototype._attach = function(connection) {
  var self = this

  connection.once('readyForQuery', function() {
    console.log('ready for query')
    self._con.parse({
      text: self._text
    }, true)
    self._con.bind({
      values: self._values
    }, true)
    self._con.describe({
      type: 'P',
      name: ''
    }, true)
    self._con.flush()
    self._con.once('bindComplete', function() {
      console.log('bound')
      self._bound = true
      //kick the reader to start the process
      self._getRows(1)
    })
    self._con.once('rowDescription', function(desc) {
      this.rowDescription = desc;
      console.log('got row desc!')
    })
    self._con.on('dataRow', function(row) {
      console.log('dataRow', row.fields)
      var more = self.push(row.fields)
    })
    self._con.once('commandComplete', function() {
      console.log('command complete')
      self._con.sync()
    })
    self._con.once('readyForQuery', function() {
      console.log('readyForQuery!')
      self.push(null)
      self._con.end()
    })
  })
}

QueryStream.prototype._connect = function(n) {
  if(this._connected) return true;
  this._connected = true
  console.log('in _connect')
  var self = this
  var connection = this._con
  connection.connect(process.env.PGPORT, process.env.PGHOST)
  connection.on('error', function(e) {
    self.emit('error', e)
  })

  connection.once('connect', function() {
    console.log('connected')
    connection.startup({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE
    })
    self._attach(connection)
  })

  return false
}

QueryStream.prototype._getRows = function(n) {
  console.log('_getRows', n)
  var self = this
  self._con.execute({
    portal: '',
    rows: n
  }, true)
  self._con.flush()
}

QueryStream.prototype._read = function(n) {
  if(!this._connect(n)) return;
  //apparently n is always 1 in object mode
  this._getRows(n)
}

QueryStream.prototype.end = function(cb) {
  this._con.end()
  this._con.stream.on('end', cb)
}
