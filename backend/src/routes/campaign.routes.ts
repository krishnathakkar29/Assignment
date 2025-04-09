import express from "express";
import {
  createCampaign,
  deleteCampaign,
  getCampaigns,
  getSingleCampaign,
  updateCampaign,
} from "../controllers/campaign.controller.js";

const router = express.Router();

router.route("/campaigns").get(getCampaigns).post(createCampaign);

router
  .route("/campaigns/:id")
  .get(getSingleCampaign)
  .put(updateCampaign)
  .delete(deleteCampaign);

export default router;
