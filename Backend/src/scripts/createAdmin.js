import bcrypt from "bcryptjs";
import { createAdminUser } from "../models/userModel.js";
import { pool } from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    // Admin credentials
    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123" // In a real application, this should be changed immediately after first login
    };

    // Check if admin user already exists
    const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [adminData.email]);
    if (existingUsers.length > 0) {
      console.log("Admin user already exists. Use 'npm run recreate-admin' to recreate.");
      process.exit(0);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin user
    const userId = await createAdminUser({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword
    });

    console.log("Admin user created successfully with ID:", userId);
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    console.log("Please change the password after first login for security reasons.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();