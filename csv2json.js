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

  Transform.call(this, opt)

  this.separator = opt.separator ? opt.separator : ';'
  this.quote = opt.quote ? opt.quote : '"'

  this.headers = []
  this.unfinished = {index: 0, temp: null}
  this.columns = 0
  this.first = true

  this.re = {
    quote: new RegExp(`^${this.quote}(.*)${this.quote}$`, 'g'),
    separator: new RegExp(`${this.quote}?${this.separator}${this.quote}?`, 'g'),
    firstQuote: new RegExp(`^${this.quote}`),
    lastQuote: new RegExp(`${this.quote}$`),
    eol: /\r?\n/
  }
}

util.inherits(Csv2json, Transform)

Csv2json.prototype._transform = function(chunk, encoding, callback) {
  let data = chunk.toString()

  data.split(this.re.eol).map(v => {
    let data = v.trim()
    let hasLastQuote = this.re.lastQuote.test(data)

    data = data.replace(this.re.firstQuote, '')
      .replace(this.re.lastQuote, '')
      .split(this.re.separator)

    if(this.first === true && this.columns === 0) {
      this.push('[')
      this.headers = data.map(e => e.replace(this.quote, ''))
      this.columns = this.headers.length
      return 
    }

    let temp = {}
    let i = 0

    if(this.unfinished.temp !== null) {
      temp = this.unfinished.temp
      i = this.unfinished.index
      this.unfinished.temp = null

      let j = i
      while(j-- && j > 0) { data.unshift(null) }

      if(this.unfinished.hasLastQuote === false) {
        i-- 
      }
    }

    for(; i < this.columns; i++) {

      if(data[i] === undefined) {
        this.unfinished.temp = temp 
        this.unfinished.index = i 
        this.unfinished.hasLastQuote = hasLastQuote
        break;
      }

      let s = this.re.quote.exec(data[i])

      s = s === null ? data[i] : s[1]

      if(temp[this.headers[i]] !== undefined)
        temp[this.headers[i]] =  temp[this.headers[i]] + s
      else
        temp[this.headers[i]] = s
    }

    if(this.unfinished.temp === null) {
      if(this.first === true) {
        this.first = false
        this.push(JSON.stringify(temp))
      } else {
        this.push(',' + JSON.stringify(temp))
      }
    }
  })

  callback()
}

Csv2json.prototype._flush = function(callback) {
  this.push(']')
  callback()
}

module.exports = Csv2json
