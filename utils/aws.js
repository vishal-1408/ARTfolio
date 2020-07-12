const aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

const s3= new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
secretAccessKey: process.env.SECRET_ACCESS_KEY,
Bucket: "artfolio-1408"
});

module.exports = s3;
