import path from "path";
import fs from "fs";
import uploadToCloudinary from "../utils/cloudinary.util.js";
import { convertDocxToPdf, convertPdfToImage } from "../utils/convert.util.js";

const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    let pdfPath = req.file.path;

    // Convert DOCX/DOC to PDF
    if (ext === ".doc" || ext === ".docx") {
      pdfPath = await convertDocxToPdf(req.file.path);
    }

    // Convert PDF to JPEG image (first page)
    const imagePath = await convertPdfToImage(pdfPath);

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(imagePath);

    // Safely clean up all local files
    [req.file.path, pdfPath, imagePath].forEach((file) => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    return res.status(200).json({
      image_url: cloudinaryResult.secure_url,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default handleFileUpload;
