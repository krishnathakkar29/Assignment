import { Request, Response, NextFunction } from "express";
import { generatePersonalizedMessage } from "../lib/gemini";

// Define interface for profile data
interface ProfileData {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
  [key: string]: any; // For any additional fields
}

export const createPersonalizedMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profileData = req.body as ProfileData;
    console.log("Received profile data:", profileData); // Debug log

    const requiredFields = [
      "name",
      "job_title",
      "company",
      "location",
      "summary",
    ];
    const missingFields = requiredFields.filter((field) => !profileData[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        status: "error",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    const message = await generatePersonalizedMessage(profileData);
    res.status(200).json({
      status: "success",
      message: message,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error in createPersonalizedMessage:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to generate personalized message",
      error: err.message || "Internal Server Error",
    });
  }
};
