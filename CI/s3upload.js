const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET
});

upload = filePath => {
  const file = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.CDS3BUCKET,
    Key: "artifacts.zip", // File name you want to save as in S3
    Body: file
  };

  s3.upload(params, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

upload("./artifacts.zip");
