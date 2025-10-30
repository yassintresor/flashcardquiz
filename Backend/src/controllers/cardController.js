import {
  getCardsByDeck,
  getCardById,
  createCard,
} from "../models/cardModel.js";
import { pool } from "../config/database.js";


export const getCards = async (req, res) => {
  try {
    const { deckId } = req.params;
    const cards = await getCardsByDeck(deckId);

    if (!cards.length)
      return res.status(404).json({ message: "No cards found for this deck" });

    res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Error fetching cards" });
  }
};

export const getSingleCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await getCardById(id);

    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ message: "Error fetching card" });
  }
};

export const addCard = async (req, res) => {
  try {
    const { deckId } = req.params;
    const {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      explanation,
    } = req.body;

    if (!question || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
      return res.status(400).json({ message: "All question and option fields are required" });
    }

    const cardId = await createCard(deckId, {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      explanation,
    });

    res.status(201).json({ message: "Card created successfully", cardId });
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ message: "Error creating card" });
  }
};


export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      explanation,
    } = req.body;

    const [existing] = await pool.query("SELECT * FROM cards WHERE id = ?", [id]);
    if (!existing.length) return res.status(404).json({ message: "Card not found" });

    await pool.query(
      "UPDATE cards SET question=?, option_a=?, option_b=?, option_c=?, option_d=?, correct_answer=?, explanation=? WHERE id=?",
      [question, option_a, option_b, option_c, option_d, correct_answer, explanation, id]
    );

    res.json({ message: "Card updated successfully" });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ message: "Error updating card" });
  }
};


export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query("SELECT * FROM cards WHERE id = ?", [id]);
    if (!existing.length) return res.status(404).json({ message: "Card not found" });

    await pool.query("DELETE FROM cards WHERE id = ?", [id]);
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ message: "Error deleting card" });
  }
};
