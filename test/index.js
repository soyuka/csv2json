'use strict'
const fs = require('fs')
const Csv2json = require('../csv2json.js')
const Transform = require('stream').Transform
const assert = require('assert')

let test = new Transform
let csv2json = new Csv2json()

let data = ''
let expected = [
  {Name: "Foo", Lastname: "Bar", Age: "19", Gender: "F", Comment: "“"},
  {Name: "Bar", Lastname: "Foo", Age: "-123", Gender: "H", Comment: "'asgdoasji"},
  {Name: "Some", Lastname: "One", Age: "0", Gender: "", Comment: "No comment"},
  {Name: "A line", Lastname: " with quotes", Age: "9", Gender: "/", Comment: "everywhere"},
]

test._transform = function(chunk, enc, cb) {
  data += chunk.toString()
  cb()
}

csv2json.on('end', function() {
  assert.deepEqual(JSON.parse(data), expected)
})

let stream = fs.createReadStream(`${__dirname}/data.csv`)

stream.on('readable', function() {
  stream.pipe(csv2json)
})

stream.on('end', function() {
  csv2json.pipe(test)
})
