const AWS = require("aws-sdk");
const fs = require("fs");
// var credentials = new AWS.SharedIniFileCredentials({profile: 'dev'});
//  AWS.config.credentials = credentials;
const s3 = new AWS.S3({
  accessKeyId: "AKIA2OVE4GWQN2RTRJN6",
  secretAccessKey: "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"
});

// s3.listBuckets((err,data) =>{
//     if(err) console.log(err)
//     else
//         console.log(data)
//         uploadFile('download.jpeg')zzz

// })

const uploadFile = (file, name) => {
  //   console.log(file.data);

  const params = {
    Bucket: process.env.S3BUCKET,
    Key: name, // File name you want to save as in S3
    Body: file.data
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

const deleteFile = name => {
  console.log(name);
  const params = {
    Bucket: process.env.S3BUCKET,
    Key: name // File name you want to save as in S3
  };

  s3.deleteObject(params, (err, data) => {
    if (err) throw err;
    console.log(`File Deleted successfully. `);
  });
};

module.exports = { uploadFile, deleteFile };
