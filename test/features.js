'use strict'
const fs = require('fs')
const Csv2json = require('../')
const Transform = require('stream').Transform
const assert = require('assert')

const expected = [
  {Name: "Foo", Lastname: "Bar", Age: "19", Gender: "F", Comment: "“"},
  {Name: "Bar", Lastname: "Foo", Age: "-123", Gender: "H", Comment: "'asgdoasji;"},
  {Name: "Some", Lastname: "One", Age: "0", Gender: "", Comment: "No comment"},
  {Name: "A line", Lastname: " with quotes", Age: "9", Gender: "/", Comment: "everywhere"},
  {Name: "test", Lastname: "test", Age: "", Gender: "", Comment: "some string with ; a semicol"},
  {Name: "", Lastname: "", Age: "", Gender: "", Comment: ""}

]

let test = new Transform
let csv2json = new Csv2json()
let data = ''

test._transform = function(chunk, enc, cb) {
  data += chunk.toString()
  cb()
}

csv2json.on('end', function() {
  console.log(JSON.parse(data))
  assert.deepEqual(JSON.parse(data), expected)
})

let stream = fs.createReadStream(`${__dirname}/fixtures/data.csv`)

stream.pipe(csv2json)
.pipe(test)
