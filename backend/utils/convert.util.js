import path from "path";
import { execSync } from "child_process";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfPoppler = require("pdf-poppler");

// Ensure directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Convert DOCX to PDF
export const convertDocxToPdf = async (docxPath) => {
  const outputDir = path.dirname(docxPath);
  execSync(
    `libreoffice --headless --convert-to pdf "${docxPath}" --outdir "${outputDir}"`
  );
  return docxPath.replace(path.extname(docxPath), ".pdf");
};

// Convert PDF to image (first page only)
export const convertPdfToImage = async (pdfPath) => {
  const convertedDir = path.resolve("public/converted");
  ensureDir(convertedDir);

  const outputPrefix = path.basename(pdfPath, path.extname(pdfPath));
  const options = {
    format: "jpeg",
    out_dir: convertedDir,
    out_prefix: outputPrefix,
    page: 1,
  };

  await pdfPoppler.convert(pdfPath, options);

  const imagePath = path.join(convertedDir, `${outputPrefix}-1.jpg`);

  // Safely check for output file
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image conversion failed: ${imagePath} not found`);
  }

  return imagePath;
};
