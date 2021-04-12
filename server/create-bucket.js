//requireing the software development kit for AWS
//Load the AWS SDK for Node.js
const AWS = require('aws-sdk')
//import the uuid package to create a unqie S3 buket name
const {v4: uuidv4} = require('uuid')
//Set the region
AWS.config.update({region: 'us-east-2'})
//Create S3 service object with the designated API 
const s3 = new AWS.S3({apiVersion: '2006-03-01'})

//Create the params for the object that assigns the metadata of the bucket
var bucketParams = {
    Bucket: "user-images-" + uuidv4()
};

//Call S3 to create the bucket
s3.createBucket(bucketParams, (err, data) => {
    if(err){
        console.log("Error", err)
    } else {
        console.log("Success")
    }
})