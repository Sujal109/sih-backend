import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

import {
  createClaim,
  approveClaim,
  rejectClaim,
  getAllClaims,
} from "../controllers/claimController.js";

const router = express.Router();

// Cloudinary + Multer setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "claims_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

router.post("/", upload.array("images", 5), createClaim);
router.put("/:id/approve", approveClaim);
router.put("/:id/reject", rejectClaim);
router.get("/", getAllClaims);

export default router;
