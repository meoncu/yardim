import { S3Client } from '@aws-sdk/client-s3';

// R2 requires standard S3 API compatibility
// endpoint format: https://${ACCOUNT_ID}.r2.cloudflarestorage.com

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';

export const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
