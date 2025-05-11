import express from "express";
import upload from "../middlewares/multer.middleware.js";
import handleFileUpload from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload", upload.single("resume"), handleFileUpload);

export default router;
