import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const uploadCoverImage = async (fileBuffer: Buffer, originalName: string) => {
  const fileSizeLimit = 5 * 1024 * 1024; // 5MB
  if (fileBuffer.length > fileSizeLimit) {
    throw new Error('File exceeds maximum size of 5MB');
  }

  const contentType = mime.lookup(originalName);
  if (!contentType || !['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) {
    throw new Error('Unsupported file type. Please upload JPG, PNG, or WebP.');
  }

  const fileKey = `covers/${uuidv4()}.${mime.extension(contentType)}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'public-read',
  });
  await s3.send(command);
  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
};
