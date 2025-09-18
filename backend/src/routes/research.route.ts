import { Router } from "express";
import {
  getAllResearch,
  getSpecificResearch,
  newTopicResearch,
} from "../controllers/research.controller";

const router = Router();

router.post("/research", newTopicResearch);
router.get("/research", getAllResearch);
router.get("/research/:id", getSpecificResearch);

export default router