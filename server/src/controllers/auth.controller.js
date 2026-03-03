import db from "../config/db.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Hashing error" });
      }

      const result = await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hash]
      );

      const user = result.rows[0];

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({success: false , message: "Login error" });
        }
        res.json({success: true, message: "Registered successfully", user });
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({success: false, message: "Server error" });
  }
};

