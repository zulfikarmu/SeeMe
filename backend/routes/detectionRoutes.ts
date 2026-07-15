import { Router } from "express";
import { DetectionController } from "../controllers/detectionController";

const router = Router();

// Endpoint for image forensic detection
router.post("/detect", DetectionController.detect);

export default router;
