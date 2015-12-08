# csv2json

Name
        csv2json - Basic Csv To Json

Synopsis
        csv2json [ --separator ] [ --quote ]
                 [ file ]

Description

        Transform to json and pipe to jq:

        csv2json < data.csv | jq . 

        Redirect output to file

        csv2json < data.csv > data.json

Options

        --separator         sets the csv separator, default ;
        --quote             csv quote character, default "

