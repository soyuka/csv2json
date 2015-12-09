# csv2json [![Build Status](https://travis-ci.org/soyuka/csv2json.svg?branch=master)](https://travis-ci.org/soyuka/csv2json)

This does work as a stream, and you can do:

```
let csv2json = require('@soyuka/csv2json')

fs.createReadStream('some.csv')
.pipe(csv2json)
.pipe(stdout)
```

It won't emit Javascript objects but JSON strings ! Please use [csv-parser](https://github.com/mafintosh/csv-parser/) if you need javascript objects.

Advantages:

- no dependencies
- fast
- small memory footprint


## Man

Name
        csv2json - Basic Csv To Json

Synopsis
        csv2json [ --separator ] [ --quote ]
                 [ destination ]

Description

        Transform to json and pipe to jq:

        csv2json < data.csv | jq . 

        Redirect output to file:

        csv2json < data.csv > data.json

        File destination:

        cat data.csv | csv2json --separator , data.json

Options

        --separator         sets the csv separator, default ;
        --quote             csv quote character, default "
