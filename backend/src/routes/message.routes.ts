import { Router } from "express";
import { createPersonalizedMessage } from "../controllers/message.controller";

const router = Router();

router.post("/", createPersonalizedMessage);

export default router;
