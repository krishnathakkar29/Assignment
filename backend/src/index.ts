import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import { connectDB } from "./lib/db";
import campaignRoutes from "./routes/campaign.routes";
import messageRoutes from "./routes/message.routes";
import linkedinscrapperRoutes from "./routes/scrape.route";

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/campaign", campaignRoutes);
app.use("/api/v1/scrape", linkedinscrapperRoutes);

app.get("/health", (req: Request, res: Response): void => {
  res.status(200).json({ status: true, message: "Server is healthy" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
