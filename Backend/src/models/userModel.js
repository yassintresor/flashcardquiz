import { pool } from "../config/database.js";

export const getUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const createUser = async (userData) => {
  const { name, email, password, role = "client" } = userData;
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );
  return result.insertId;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [id]);
  return rows[0];
};

export const createAdminUser = async (adminData) => {
  const { name, email, password } = adminData;
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, "admin"]
  );
  return result.insertId;
};