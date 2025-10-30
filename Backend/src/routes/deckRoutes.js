import express from "express";
import * as Deck from "../controllers/deckContoller.js";
// Remove auth middleware for development
// import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", Deck.getAllDecks);
router.get("/:id", Deck.getDeckById);
// Remove auth middleware for development
router.post("/", Deck.createDeck);
router.put("/:id", Deck.updateDeck);
router.delete("/:id", Deck.deleteDeck);

export default router;