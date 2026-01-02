import cloudinary from '../config/cloudinary.js';

// Lấy publicId từ URL Cloudinary
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;

  // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/filename.jpg
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');

  if (uploadIndex === -1) return null;

  // Lấy phần sau "upload/v123/"
  const pathParts = parts.slice(uploadIndex + 2); // Bỏ qua "upload" và version
  const fullPath = pathParts.join('/');

  // Bỏ extension
  return fullPath.replace(/\.[^/.]+$/, '');
};

// Xóa ảnh trên Cloudinary
export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return null;

    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return null;
  }
};

// Xóa nhiều ảnh
export const deleteMultipleImagesFromCloudinary = async (imageUrls) => {
  try {
    if (!imageUrls || imageUrls.length === 0) return [];

    const deletePromises = imageUrls.map((url) =>
      deleteImageFromCloudinary(url)
    );
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    return [];
  }
};
