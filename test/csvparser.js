'use strict'
const fs = require('fs')
const Csv2json = require('csv-parser')
const assert = require('assert')

const expected = [
  {Name: "Foo", Lastname: "Bar", Age: "19", Gender: "F", Comment: "“"},
  {Name: "Bar", Lastname: "Foo", Age: "-123", Gender: "H", Comment: "'asgdoasji;"},
  {Name: "Some", Lastname: "One", Age: "0", Gender: "", Comment: "No comment"},
  {Name: "A line", Lastname: " with quotes", Age: "9", Gender: "/", Comment: "everywhere"},
  {Name: "test", Lastname: "test", Age: "", Gender: "", Comment: "some string with ; a semicol"},
  {Name: "", Lastname: "", Age: "", Gender: "", Comment: ""}

]

let csv2json = new Csv2json({separator: ';'})
let data = []

fs.createReadStream(`${__dirname}/fixtures/data.csv`)
.pipe(csv2json)
.on('data', function(chunk) {
  data.push(chunk)
})
.on('end', function() {
  JSON.parse(JSON.stringify(data))
  assert.deepEqual(data, expected)
})

