'use strict'
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite

suite.add('Parse#csv2json', function() {
 require('./features.js')
})
.add('Parse#csvparser', function() {
 require('./csvparser.js')
})
.on('cycle', function(event) {
  console.log(String(event.target))
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({async: true})
