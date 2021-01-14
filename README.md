# Maestro Language Learning API!

This application was built using Express and Node. PostgreSQL was used for the database and it uses postgrator migrations to create necessary tables and seed them. 

The client side of this application can be found [here](https://github.com/alannabouloy/spaced-repetition)

There are three main routes for the endpoints. 

`/api/auth` has one endpoint attached to it. 
   1. `/api/auth/token` allows for two request types. The first is POST which allows the user to log in and will return a JWT token for future authentication in order to access protected endpoints. 
   Example request bodies should look like so: 
         {
            "username" : "exampleuser",
            "password" : "Examplepa5s!"
         }

   2. the second request type for this endpoint is a PUT request which reupdates the authorization of the user once their token is set to expire. It is a protected endpoint and it will return a new JWT with an updated expiration time. 

`/api/user` supports only one request type: POST, and will allow a user to submit information in order to create a new user account. Request bodies should look like so:
   {
      "username" : "exampleuser",
      "password" : "Examplepa5s!",
      "name" : "Jane Doe"
   }

All fields are required, and username cannot belong to a preexisting user. Provided password must be over 8 characters and less than 72 characters in length. It also cannot begin or end with a space character and must include an uppercase, lowercase, numeric, and special character. 

`/api/language` has three endpoints attached to it. All endpoints are protected endpoints and require a valid JWT to access. 

1. `/api/language` supports just one request type: GET. It will return  a json object that includes the language and an array of word objects associated with the user sending the request. Example response should look like so:
      {
         "language": {
            "id": 1,
            "name": "Spanish",
            "total_score": 16,
            "user_id": 1,
            "head" : 1
         },
         "words": [
            {
               "id": 1,
               "language_id": 1,
               "original": "hola",
               "translation": "hello",
               "next": null,
               "memory_value": 1,
               "correct_count" 1,
               "incorrect_count": 1
            },
         ]
      }

2. `/api/language/head` also supports just one request: GET. It will return a json object that includes the word currently listed as the head for the list of words in table. Responses will be formatted like so:
      {
         "nextWord": "hola",
         "wordCorrectCount": 1,
         "wordIncorrectCount": 1,
         "totalScore": 1
      }

3. `/api/language/guess` only supports one request type: POST. Requests sent must include a 'guess' key value and should look similar to: 
      {
         "guess" : "thisIsAGuess"
      }
The endpoint will run the user's guess through validation to determine if it is correct and update the database to reflect the results. You can expect responses to be formatted thus:
      {
         "nextWord" : "hola",
         "totalScore": 2,
         "wordCorrectCount": 2,
         "wordIncorrectCount": 1,
         "answer": "hello",
         "isCorrect": true,
      }

