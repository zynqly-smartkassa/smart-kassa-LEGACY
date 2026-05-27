import pool from "../db.js";

export const isGuest = async (id) => {
  const result = await pool.query(
    `SELECT
        users.is_guest
      FROM users
      WHERE users.user_id = $1`,
    [id],
  );

  return result.rows[0].is_guest;
};
