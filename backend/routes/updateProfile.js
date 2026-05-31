import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";
import { isGuest } from "../services/guestCheck.js";
import { checkGuest } from "../middleware/isGuest.js";

const router = express.Router();

// PUT /account/me
router.put("/me", authenticateToken, checkGuest, async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const user_id = req.user.userId;

  const fields = [];
  const values = [];
  let idx = 1;

  if (first_name !== undefined) {
    fields.push(`first_name = $${idx++}`);
    values.push(first_name);
  }
  if (last_name !== undefined) {
    fields.push(`last_name = $${idx++}`);
    values.push(last_name);
  }
  if (email !== undefined) {
    fields.push(`email = $${idx++}`);
    values.push(email);
  }

  if (fields.length === 0) {
    return res.status(400).json({
      error: "No data provided",
      message: "Send first_name/last_name/email",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET ${fields.join(", ")}
       WHERE user_id = $${idx}
       RETURNING user_id, first_name, last_name, email`,
      [...values, user_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
