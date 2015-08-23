### Vroom REST API

1. DEMO:

[https://vroumapi.herokuapp.com/](https://vroumapi.herokuapp.com/)

---

2. TEST:

  Coverage: [![Build Status](https://travis-ci.org/julesGoullee/vroumApi.svg)](https://travis-ci.org/julesGoullee/vroumApi)
  
    Run: `npm test`

---
    
3. Request

  A. Status
  
  * Method: GET
  * URL: /
  ```bash
  curl -i
    -H "Accept: application/json" 
    -H "Content-Type: application/json"
    -X GET https://vroumapi.herokuapp.com
  ```
  
  B. Marques
  
   Structure one Marque:
```json
{
  _id: ObjectIdMongo,
  name: string,
  description: string,
  modified: Date(automatique last modified date),
  version: int(Number update revision)   
}
```

   GetAll marques:
   
  * Method: GET
  * URL /marques
  
```bash
    `curl -i
       -H "Accept: application/json"
       -H "Content-Type: application/json"
       -X GET https://vroumapi.herokuapp.com/marques
```

  Create one marque
    
  * Method: POST
  * URL: /marques
  * PARAMS: 
  
```json
{
  name: string,
  description: string
}
```



`curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{ "name":"marque1", "description":"descriptionMarque1"}' https://vroumapi.herokuapp.com/marques`
#####GetOne marque
Method: GET
URL: /marques/{{marque._id}}
`curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://vroumapi.herokuapp.com/marques/55d471678bd0f3110018aa0f`
#####Update marque
Method: PUT
URL: /marques/{{marque._id}}

`curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X PUT -d '{ "name":"marque1Update1", "description":"descriptionMarque1Update1"}' https://vroumapi.herokuapp.com/marques/55d471678bd0f3110018aa0f`
#####Delete one marque
`curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://vroumapi.herokuapp.com/marques/55d471678bd0f3110018aa0f`