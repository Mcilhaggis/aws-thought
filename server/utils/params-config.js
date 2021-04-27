// This files purpose it so return a configured params obj. We'll use a package called uuid that will generate a unique 36-char alphanumeric string, which we'll use as the image names

//If a file name is duplicated then the original file will be overwritten with
const { v4: uuidv4 } = require('uuid');


//recieves param called fileName
const params = fileName => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];
  //once the reference to the fileType is stored we'll decalre imageParams
    const imageParams = {
      Bucket: 'user-images-a0a1beab-5c71-483f-bfa8-d2d29070e3ba',
      Key: `${uuidv4()}.${fileType}`,
      Body: fileName.buffer
    };
  
    return imageParams;
  };
  module.exports = params;