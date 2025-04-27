import express from "express";
import { chillAI } from "../controllers/ai.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/ai", chillAI);

export default router;
