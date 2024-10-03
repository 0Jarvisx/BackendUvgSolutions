const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
require("dotenv").config();
const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

console.log("REGION", process.env.AWS_REGION);
const s3 = new S3Client({ region: process.env.AWS_REGION });
const sns = new SNSClient({ region: process.env.AWS_REGION });
const ses = new SESClient({ region: process.env.AWS_REGION });

module.exports = {
  s3,
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  getSignedUrl,
  sns,
  PublishCommand,
  ses,
  SESClient,
  SendEmailCommand,
};
