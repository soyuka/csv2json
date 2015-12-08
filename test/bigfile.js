'use strict'
const fs = require('fs')
const Csv2json = require('../')
const Transform = require('stream').Transform
const assert = require('assert')

let test = new Transform
let csv2json = new Csv2json()
let data = ''

test._transform = function(chunk, enc, cb) {
  data += chunk.toString()
  cb()
}

csv2json.on('end', function() {
  JSON.parse(data)
})

let stream = fs.createReadStream(`${__dirname}/fixtures/FL_insurance_sample.csv`)

stream.pipe(csv2json)
.pipe(test)
