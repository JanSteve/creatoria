const { GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../config/s3');

/**
 * Generate a pre-signed download URL for a file stored in S3.
 * URL expires after 3600 seconds (1 hour).
 *
 * @param {string} fileKey - The S3 object key.
 * @returns {Promise<string>} Pre-signed download URL.
 */
const generateDownloadUrl = async (fileKey) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: fileKey,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return signedUrl;
};

/**
 * Generate a pre-signed upload URL for putting a file into S3.
 * URL expires after 3600 seconds (1 hour).
 *
 * @param {string} fileKey - The desired S3 object key.
 * @param {string} contentType - The MIME type of the file being uploaded.
 * @returns {Promise<string>} Pre-signed upload URL.
 */
const generateUploadUrl = async (fileKey, contentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: fileKey,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return signedUrl;
};

module.exports = { generateDownloadUrl, generateUploadUrl };
