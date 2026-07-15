import { Request, Response } from "express";
import { AIDetectionService } from "../services/aiDetectionService";

export class DetectionController {
  /**
   * Handles POST /api/detect
   */
  public static async detect(req: Request, res: Response): Promise<void> {
    try {
      const { image, fileName, mimeType } = req.body;

      if (!image) {
        res.status(400).json({ error: "Missing image data. Please upload an image." });
        return;
      }

      const name = fileName || "unnamed_image.jpg";
      const mime = mimeType || "image/jpeg";

      // Perform detection
      const result = await AIDetectionService.analyzeImage(image, mime, name);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in DetectionController:", error);
      res.status(500).json({
        error: "An error occurred during image forensic analysis.",
        details: error.message || error,
      });
    }
  }
}
