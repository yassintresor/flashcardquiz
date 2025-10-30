import { pool } from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

const listUsers = async () => {
  try {
    const [users] = await pool.query("SELECT id, name, email, role FROM users");
    
    console.log("Users in the database:");
    console.log("----------------------");
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error listing users:", error);
    process.exit(1);
  }
};

listUsers();