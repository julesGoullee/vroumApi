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
   
    ```javascript
    {
      _id: ObjectIdMongo,
      name: String,
      description: String,
      modified: Date(automatique last modified date),
      version: Number(Number update revision) 
    }
    ```

  GetAll marques:
   
  * Method: GET
  * URL /marques
  
      ```bash
      curl -i
         -H "Accept: application/json"
         -H "Content-Type: application/json"
         -X GET https://vroumapi.herokuapp.com/marques
      ```

  Create one marque
    
  * Method: POST
  * URL: /marques
  * PARAMS: 
  
      ```javascript
      {
        "name": String,
        "description": String
      }
      ```
      
      ```bash
      curl -i 
        -H "Accept: application/json"
        -H "Content-Type: application/json"
        -X POST -d '{
          "name": "marque1",
          "description": "descriptionMarque1"
         }'
         https://vroumapi.herokuapp.com/marques
      ```
       
  GetOne marque
  
  * Method: GET
  * URL: /marques/{{marque._id}}
  
      ```bash
      curl -i 
        -H "Accept: application/json"
        -H "Content-Type: application/json" 
        -X GET https://vroumapi.herokuapp.com/marques/{{marque._id}}
      ```
      
  Update marque
  
  * Method: PUT
  * URL: /marques/{{marque._id}}

      ```bash
      curl -i 
        -H "Accept: application/json" 
        -H "Content-Type: application/json" 
        -X PUT -d '{ 
          "name": "marque1Update1",
          "description": "descriptionMarque1Update1"
        }'
        https://vroumapi.herokuapp.com/marques/{{marque._id}}
      ```
        
  Delete one marque
  
  * Method: DELETE
  * URL: /marques/{{marque._id}}
  
      ```bash
      curl -i 
        -H "Accept: application/json" 
        -H "Content-Type: application/json" 
        -X DELETE https://vroumapi.herokuapp.com/marques/{{marque._id}}
      ```
 
 C. Vehicule
 
 Structure one vehicule:
    
     ```javascript
     {
       _id: ObjectIdMongo,
       name: String,
       description: String,
       year: Number,
       marqueId: ObjectIdMongo(Ref: Marque ObjectId),
       modified: Date(automatique last modified date),
       version: Number(Number update revision) 
     }
     ```
 GetAll marques:
   
  * Method: GET
  * URL /marques
  
      ```bash
      curl -i
         -H "Accept: application/json"
         -H "Content-Type: application/json"
         -X GET https://vroumapi.herokuapp.com/vehicules
      ```

  Create one vehicule
    
  * Method: POST
  * URL: /marques
  * PARAMS: 
  
      ```javascript
      {
        "name": String,
        "description": String,
        "year": Number,
        "marqueId": ObjectIdMongo(Ref: Marque ObjectId)
      }
      ```
      
      ```bash
      curl -i 
        -H "Accept: application/json"
        -H "Content-Type: application/json"
        -X POST -d '{
          "name": "vehicule1",
          "description": "descriptionVehicule1",
          "years": "2009"
         }'
         https://vroumapi.herokuapp.com/vehicule
      ```
  
  GetOne vehicule
    
    * Method: GET
    * URL: /vehicules/{{vehicule._id}}
    
        ```bash
        curl -i 
          -H "Accept: application/json"
          -H "Content-Type: application/json" 
          -X GET https://vroumapi.herokuapp.com/vehicules/{{marque._id}}
        ```