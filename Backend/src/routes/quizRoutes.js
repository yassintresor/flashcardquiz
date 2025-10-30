import express from "express";
import { startQuiz, submitAnswer, submitScore } from "../controllers/quizController.js";

const router = express.Router();

router.post("/start", startQuiz);
router.post("/answer", submitAnswer);
router.post("/submit", submitScore);

export default router;
