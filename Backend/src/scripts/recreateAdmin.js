import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

const recreateAdmin = async () => {
  try {
    // Admin credentials
    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123" // In a real application, this should be changed immediately after first login
    };

    // Delete existing admin user if exists
    await pool.query("DELETE FROM users WHERE email = ?", [adminData.email]);
    console.log("Existing admin user deleted (if existed)");

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [adminData.name, adminData.email, hashedPassword, "admin"]
    );

    console.log("Admin user recreated successfully with ID:", result.insertId);
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    console.log("Please change the password after first login for security reasons.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error recreating admin user:", error);
    process.exit(1);
  }
};

recreateAdmin();