import express from "express";
import pool from "../db.js";
import argon2 from "argon2";
import { authenticateToken } from "../middleware/auth.js";
import { checkGuest } from "../middleware/isGuest.js";

const router = express.Router();

/**
 * DELETE /account
 * Deletes the authenticated user's account
 * Requires password confirmation for safety
 * uses both tokens
 */
router.delete("/", authenticateToken, checkGuest, async (req, res) => {
  const { password } = req.body;
  const refreshToken = req.cookies.refreshToken;
  const user_id = req.user.userId;

    if (isGuest(user_id)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Guest User can not update his Profile",
      });
    }

  // to check which value is missing
  if (!refreshToken || !user_id) {
    let missingFieldsMessage = "Refresh Token or User ID are not provided"; // a let variable to dynamically change the message depending on what's missing
    if (!user_id && refreshToken) {
      missingFieldsMessage = "User ID is not provided";
    } else if (user_id && !refreshToken) {
      missingFieldsMessage = "Refresh Token is not provided";
    }

    console.error(
      "Delete Account Error: Fields Missing \n",
      missingFieldsMessage,
    );

    return res.status(400).send({
      error: "Fields missing",
      message: missingFieldsMessage,
    });
  }

  try {
    await pool.query("BEGIN");

    // user has to provide his password to delete his account
    const dbpassword = await pool.query(
      "SELECT password_hash FROM users where user_id = $1",
      [user_id],
    );

    if (dbpassword.rowCount === 0) {
      console.error("Delete Account Error: User not found");
      return res
        .status(400)
        .json({ error: "User not found", path: "/deleteacount, line: 52" });
    }

    const validPassword = await argon2.verify(
      dbpassword.rows[0].password_hash,
      password,
    );

    if (!validPassword) {
      console.error("Delete Account Error: Invalid Password");
      return res
        .status(401)
        .json({ error: "Invalid password", path: "/delete/acount" });
    }

    const result = await pool.query(
      `UPDATE users SET email = null, phone_number = NULL, first_name = 'Deleted', last_name = 'User', password_hash = NULL, is_deleted = true, deleted_at = NOW() WHERE user_id = $1`,
      [user_id],
    );

    if (result.rowCount === 0) {
      console.error("Delete Account Error: User not found");
      return res
        .status(404)
        .send({ error: "User not found", path: "/deleteacount, line: 74" });
    }

    await pool.query(
      `UPDATE session SET user_agent = NULL, client_ip = NULL, device_name = NULL where user_id = $1`,
      [user_id],
    );

    /**
     * @todo If user roles are implemented, this function call should check if the user is a company owner or not
     */
    const company = await pool.query(
      `SELECT company_id FROM users WHERE user_id = $1`,
      [user_id],
    );

    if (company.rows[0].company_id) {
      await pool.query(
        `UPDATE company SET is_deleted = TRUE, deleted_at = NOW() WHERE company_id = $1`,
        [company.rows[0].company_id],
      );
    }

    await pool.query("COMMIT");

    res.clearCookie("refreshToken", {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
    });

    return res.status(200).send({
      message: "Account deleted successfully",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Delete Account Error: ", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
