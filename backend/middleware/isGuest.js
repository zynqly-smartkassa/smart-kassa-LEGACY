import pool from "../db.js";

export async function checkGuest(req, res, next) {
  const user_id = req.user.userId;

  const result = await pool.query(
    `SELECT
        users.is_guest
      FROM users
      WHERE users.user_id = $1`,
    [user_id],
  );

  if (result.rows[0].is_guest) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Guest User can not update his Profile",
    });
  }

  next();
}
