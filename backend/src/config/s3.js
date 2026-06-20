const { S3Client } = require('@aws-sdk/client-s3');

/**
 * Configured AWS S3 client for file storage operations.
 * @type {import('@aws-sdk/client-s3').S3Client}
 */
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

module.exports = s3Client;
