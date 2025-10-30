import { pool } from "../config/database.js";

export const getAllDecks = async () => {
  const [rows] = await pool.query("SELECT * FROM decks");
  return rows;
};

export const getDeckById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM decks WHERE id = ?", [id]);
  return rows[0];
};

export const createDeck = async (data) => {
  const { name, description, category } = data;
  const [result] = await pool.query(
    "INSERT INTO decks (name, description, category) VALUES (?, ?, ?)",
    [name, description, category]
  );
  return result.insertId;
};

export const updateDeck = async (id, data) => {
  const { name, description, category } = data;
  await pool.query(
    "UPDATE decks SET name=?, description=?, category=? WHERE id=?",
    [name, description, category, id]
  );
};

export const deleteDeck = async (id) => {
  await pool.query("DELETE FROM decks WHERE id = ?", [id]);
};
