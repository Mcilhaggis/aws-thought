const express = require('express');
const router = express.Router();
// Provides middlware for handling multipart/form-data
// The multer package will add a file property on the req obj that contains the image file uploade by the form 
const multer = require('multer');
//imports the mutler file name we jsut assinged the saved item
const AWS = require('aws-sdk');

const paramsConfig = require('../utils/params-config');

// Creates a temporary storage that will hold the image files until it's ready to be uploaded
const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
      callback(null, '');
    }
  });

  //declaring upload image that contains the storage destiation and the key, image
  // image is the key!
const upload = multer({storage}).single('image');

const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
  })


  router.post('/image-upload', upload, (req, res) => {
    console.log("post('/api/image-upload'", req.file);
    // we retrieve the image file object, req.file, from the route using multe
    const params = paramsConfig(req.file);
    // use the s3 service interface object we instantiated previously with the aws-sdk package to call the upload() method
    s3.upload(params, (err, data) => {
      if(err) {
        console.log(err); 
        res.status(500).send(err);
      }
      // In the last statement of this route, we send the data retrieved from S3 back to the client.
      // The data will contain the image file's metadata, including the URL, bucket name, file name, and more
      console.log(res.json(data))
      res.json(data);
    });
  });
  
  module.exports = router;