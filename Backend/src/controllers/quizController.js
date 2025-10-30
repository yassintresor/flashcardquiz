import { pool } from "../config/database.js";

export const startQuiz = async (req, res) => {
  try {
    const { deck_id, user_id } = req.body;
    const [cards] = await pool.query("SELECT * FROM cards WHERE deck_id = ?", [deck_id]);
    if (!cards.length) return res.status(404).json({ message: "No cards found" });

    res.json({ session_id: Date.now(), deck_id, first_card: cards[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitAnswer = async (req, res) => {
  const { card_id, selected_answer } = req.body;
  const [rows] = await pool.query("SELECT * FROM cards WHERE id = ?", [card_id]);
  const card = rows[0];
  if (!card) return res.status(404).json({ message: "Card not found" });

  const is_correct = card.correct_answer === selected_answer;
  res.json({
    is_correct,
    correct_answer: card.correct_answer,
    explanation: card.explanation,
  });
};

export const submitScore = async (req, res) => {
  try {
    const { deck_id, user_id, score, total_questions } = req.body;
    await pool.query(
      "INSERT INTO game_sessions (user_id, deck_id, score, total_questions) VALUES (?, ?, ?, ?)",
      [user_id || null, deck_id, score, total_questions]
    );
    res.json({ message: "Score saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
