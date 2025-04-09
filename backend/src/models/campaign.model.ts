// Example of what your campaign model interface might look like
import mongoose, { Document, Schema } from "mongoose";

export interface ICampaign extends Document {
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  leads: string[];
  accountIDs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DELETED"],
      default: "ACTIVE",
    },
    leads: [{ type: String }],
    accountIDs: [{ type: String }],
  },
  { timestamps: true }
);

export const Campaign = mongoose.model<ICampaign>("Campaign", campaignSchema);
