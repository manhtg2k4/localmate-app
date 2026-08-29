const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (filePath, folder = 'localmate') => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
  });
  return result.secure_url;
};

const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinary, uploadImage, deleteImage };
