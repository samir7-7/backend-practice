import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicIdFromUrl = (url) => {
  const parts = url.split("/upload/");
  const pathWithVersion = parts[1];

  // remove version like v1712345678
  const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, "");

  // remove extension like .jpg, .png, .webp
  const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, "");

  return publicId;
};

const uploadImageToCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    console.log("Image uploaded to Cloudinary:", response.url);
    return response;
    fs.unlinkSync(filePath); // Delete the local file after successful upload
  } catch (error) {
    fs.unlinkSync(filePath); // Delete the local file after upload attempt
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

const deleteImageFromCloudinary = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });
    console.log("Image deleted from Cloudinary:", response);
    return response;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

export { uploadImageToCloudinary, deleteImageFromCloudinary };
