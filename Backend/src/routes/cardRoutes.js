import express from "express";
import * as Card from "../controllers/cardController.js";
// Remove auth middleware for development
// import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get all cards in a deck
router.get("/deck/:deckId", Card.getCards);

// Get single card by ID
router.get("/:id", Card.getSingleCard);

// Add a new card to a deck (removed auth middleware for development)
router.post("/deck/:deckId", Card.addCard);

// Update a card (removed auth middleware for development)
router.put("/:id", Card.updateCard);

// Delete a card (removed auth middleware for development)
router.delete("/:id", Card.deleteCard);

export default router;