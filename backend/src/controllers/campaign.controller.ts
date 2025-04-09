import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.middleware";
import { Campaign } from "../models/campaign.model";

// Define interface for campaign request body
interface CampaignRequestBody {
  name: string;
  description: string;
  status?: "ACTIVE" | "INACTIVE" | "DELETED";
  leads?: string[];
  accountIDs?: string[];
}

export const createCampaign = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, status, leads, accountIDs } =
      req.body as CampaignRequestBody;

    const campaign = await Campaign.create({
      name,
      description,
      status: status || "ACTIVE",
      leads: leads || [],
      accountIDs: accountIDs || [],
    });

    return res.status(201).json({
      success: true,
      data: campaign,
    });
  }
);

export const getCampaigns = TryCatch(async (req: Request, res: Response) => {
  const campaigns = await Campaign.find({ status: { $ne: "DELETED" } });

  res.status(200).json({
    success: true,
    data: campaigns,
  });
});

export const getSingleCampaign = TryCatch(
  async (req: Request, res: Response) => {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      status: { $ne: "DELETED" },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: campaign,
    });
  }
);

export const updateCampaign = TryCatch(async (req: Request, res: Response) => {
  const { status, ...updateData } = req.body as CampaignRequestBody;

  if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Allowed values: ACTIVE, INACTIVE",
    });
  }

  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { ...updateData, status },
    {
      new: true,
      // runValidators: true
    }
  );

  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: "Campaign not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: campaign,
  });
});

export const deleteCampaign = TryCatch(async (req: Request, res: Response) => {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { status: "DELETED" },
    { new: true }
  );

  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: "Campaign not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Campaign soft deleted successfully",
  });
});
