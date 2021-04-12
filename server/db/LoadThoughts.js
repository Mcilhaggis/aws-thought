const AWS = require("aws-sdk");
const fs = require('fs');

AWS.config.update({
  region: "us-east-2",
  endpoint: "http://localhost:8000"
});
//The code below creates a dynamofb sevice object. Offers a level of abstraction that enables us to use Javascript obj as argueents and return native js types. 
//Helps map objects whech reduces impedance mismatching and speeds up the developement process. 
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

console.log("Importing thoughts into DynamoDB. Please wait.");
//fs.readFileSync is relative to where the file is executed not the path between files
const allUsers = JSON.parse(fs.readFileSync('./server/seed/users.json', 'utf8'));
allUsers.forEach(user => {
  //Loop over array to create the params object
  const params = {
    TableName: "Thoughts",
    //We assign the values from the array elements in the Item property
    Item: {
      "username": user.username,
      "createdAt": user.createdAt,
      "thought": user.thought
    }
  };
  //While still in the loop we make a call to the db with the service enterfae obj dynamodb as shown
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", user.username);
    }
  });
});