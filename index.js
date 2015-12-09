'use strict'
const fs = require('fs')
const Transform = require('stream').Transform
const util = require('util')

function Csv2json(opt) {
  if(!(this instanceof Csv2json)) {
    return new Csv2json(opt)
  }

  if(!opt)
    opt = {}

  Transform.call(this)

  this.separator = opt.separator ? opt.separator : ';'
  this.separator = this.toCharBuffer(this.separator)

  this.quote = opt.quote ? opt.quote : '"'
  this.quote = this.toCharBuffer(this.quote)

  this.cr = this.toCharBuffer('\r')
  this.nl = this.toCharBuffer('\n')

  this.headers = []
  this.row = {}
  this.rows = 0
  this.column = 0

  this.first = true
  this.inquote = false
}

util.inherits(Csv2json, Transform)

/**
 * Returns buffer for a character, use it to compare chunks
 * @param {String} str
 */
Csv2json.prototype.toCharBuffer = function(str) {
  return new Buffer(str)[0]
}

/**
 * @inheritdoc
 */
Csv2json.prototype._transform = function(chunk, encoding, callback) {
  let length = chunk.length
  let prev = 0
  let begin = 0
  let end = 0

  function nextColumn() {
    this.nextColumn(chunk, begin, end)
    begin = end = end + 1 + prev
    prev = 0
  }

  for (let i = 0; i < length; i++) {
    if(this.first === true) {
      this.first = false
      this.push('[')
    }

    if(this.inquote === false) {
      if(chunk[i] === this.separator) {
        nextColumn.bind(this)()
        continue
      }

      if(chunk[i] === this.nl) {
        nextColumn.bind(this)()
        this.nextRow() 
        continue
      }

      if(chunk[i] === this.cr) {
        //cr is the separator
        if(chunk[i + 1] !== this.nl) {
          nextColumn.bind(this)()
          this.nextRow() 
          continue
        } else {
          prev++
          continue
        }
      }
    }

    if(chunk[i] === this.quote) {
      if(this.inquote === false) {
        begin++
        end++
      } else {
        prev++
      }

      this.inquote = !this.inquote
      continue
    }

    end++
  }

  //leftovers
  this.row[this.headers[this.column]] = chunk.slice(begin, end)

  callback()
}

/**
 * @inheritdoc
 */
Csv2json.prototype._flush = function(callback) {
  this.push(']')
  callback()
}

/**
 * Saves column to row
 * @param {Buffer} chunk
 * @param {Number} begin
 * @param {Number} end
 */
Csv2json.prototype.nextColumn = function(chunk, begin, end) {
  let column = chunk.slice(begin, end).toString()

  if(this.rows === 0) {
    this.headers.push(column)
    return
  }

  //append to leftovers
  if(this.row[this.headers[this.column]] !== undefined) {
    this.row[this.headers[this.column]] += column
  } else {
    this.row[this.headers[this.column]] = column
  }

  this.column++
}

/**
 * Row ends, push and reset
 */
Csv2json.prototype.nextRow = function() {
  this.rows++

  if(this.rows === 1)
    return

  if(this.rows > 2)
    this.push(',')

  this.push(JSON.stringify(this.row))

  this.row = {}
  this.column = 0
}

module.exports = Csv2json
