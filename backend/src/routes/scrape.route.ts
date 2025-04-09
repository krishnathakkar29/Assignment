import express, { Request, Response, Router } from "express";
import { generateSearchURL, scrapeLinkedInProfiles } from "../lib/scrapper";

const router: Router = express.Router();

router.post("/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword } = req.body;
    console.log("Keyword received:", keyword);

    const url = generateSearchURL(keyword);
    const profiles = await scrapeLinkedInProfiles(url);
    console.log(profiles);

    res.status(200).json({
      success: true,
      data: profiles,
      count: profiles.length,
    });
  } catch (error) {
    console.error("LinkedIn scraping error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to scrape LinkedIn profiles",
    });
  }
});

export default router;
