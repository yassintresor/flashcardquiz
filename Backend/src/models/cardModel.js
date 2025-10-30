import { pool } from "../config/database.js";

export const getCardsByDeck = async (deckId) => {
  const [rows] = await pool.query("SELECT * FROM cards WHERE deck_id = ?", [deckId]);
  return rows;
};

export const getCardById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM cards WHERE id = ?", [id]);
  return rows[0];
};

export const createCard = async (deckId, data) => {
  const { question, option_a, option_b, option_c, option_d, correct_answer, explanation } = data;
  const [result] = await pool.query(
    "INSERT INTO cards (deck_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [deckId, question, option_a, option_b, option_c, option_d, correct_answer, explanation]
  );
  return result.insertId;
};
