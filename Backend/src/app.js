import express from "express";
import cors from "cors";

import deckRoutes from "./routes/deckRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/decks", deckRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.json({ message: "Flashcard Quiz API running" }));

export default app;
