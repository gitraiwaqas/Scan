import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Config should be called once in app bootstrap — but safe to keep here if reused
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided for Cloudinary upload.");
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw",
    });
    console.log(result);

    fs.unlinkSync(localFilePath); // Delete local file after upload
    return result;
  } catch (err) {
    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
    throw err;
  }
};

export default uploadToCloudinary;
