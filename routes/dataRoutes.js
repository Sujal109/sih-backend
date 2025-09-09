import express from "express";
import { createData, getAllData, getDataById } from "../controllers/dataController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createData);       // create new dataset
router.get("/", protect, getAllData);        // get all datasets
router.get("/:id", protect, getDataById);    // get dataset by ID

export default router;
