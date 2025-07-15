import multer from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

// Configure local storage for development
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// Configure multer
export const upload = multer({
  storage: process.env.NODE_ENV === 'production' ? multer.memoryStorage() : localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, Word documents, Excel files, and CSV files are allowed.'));
    }
  }
});

// Upload file to S3
export const uploadToS3 = async (file: Express.Multer.File, folder: string) => {
  try {
    const fileExtension = path.extname(file.originalname);
    const key = `${folder}/${uuidv4()}${fileExtension}`;
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET || 'vibhohcm-documents',
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private' as const
    };
    
    await s3Client.send(new PutObjectCommand(params));
    
    // Return the file URL
    return `https://${params.Bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file');
  }
};

// Delete file from S3
export const deleteFromS3 = async (fileUrl: string) => {
  try {
    // Extract bucket and key from URL
    const urlParts = fileUrl.split('/');
    const key = urlParts.slice(3).join('/');
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET || 'vibhohcm-documents',
      Key: key
    };
    
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Failed to delete file');
  }
};