### Vroom REST API

###DEMO:
    https://vroumapi.herokuapp.com/

###TEST:
  Coverage: [![Build Status](https://travis-ci.org/julesGoullee/vroumApi.svg)](https://travis-ci.org/julesGoullee/vroumApi)
  
    Run: `npm test`
    
###Request
#####Get Status
`curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://vroumapi.herokuapp.com`
#####GetAll marques
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://vroumapi.herokuapp.com/marques
#####Create one marque
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{ "name":"marque1", "description":"descriptionMarque1"}' https://vroumapi.herokuapp.com/marques
#####GetOne marque
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X PUT https://vroumapi.herokuapp.com/marques?id=55d471678bd0f3110018aa0f
    