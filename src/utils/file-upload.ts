import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Upload file
export const uploadFile = async (
  file: File,
  folder: string
): Promise<string> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await axios.post(`${API_URL}/documents/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Delete file
export const deleteFile = async (url: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    await axios.delete(`${API_URL}/documents/file`, {
      data: { url },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

// Validate file type and size
export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSizeInMB: number
): boolean => {
  // Check file type
  const fileType = file.type;
  if (!allowedTypes.includes(fileType)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error(`File size exceeds the limit of ${maxSizeInMB}MB`);
  }

  return true;
};

// Get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Generate unique filename
export const generateUniqueFilename = (file: File): string => {
  const extension = getFileExtension(file.name);
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${randomString}_${timestamp}.${extension}`;
};

export default {
  uploadFile,
  deleteFile,
  validateFile,
  getFileExtension,
  generateUniqueFilename
};