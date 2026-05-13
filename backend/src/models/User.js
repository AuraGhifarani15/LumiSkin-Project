const pool = require("../config/db");

const UserModel = {
  findByEmail: async (email) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0] || null;
  },

  findById: async (id) => {
    const { rows } = await pool.query(
      "SELECT id, name, email, avatar, created_at FROM users WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  findByGoogleId: async (googleId) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleId]);
    return rows[0] || null;
  },

  create: async ({ name, email, password }) => {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, avatar, created_at`,
      [name, email, password]
    );
    return rows[0];
  },

  /**
   * Buat atau update user via Google OAuth.
   * Jika email sudah ada, sambungkan google_id & avatar ke akun yang ada.
   * Jika belum ada, buat akun baru (password NULL — login via Google saja).
   */
  findOrCreateGoogle: async ({ googleId, name, email, avatar }) => {
    // Cek apakah sudah ada google_id
    const byGoogle = await UserModel.findByGoogleId(googleId);
    if (byGoogle) return byGoogle;

    // Cek apakah email sudah terdaftar (akun email/password)
    const byEmail = await UserModel.findByEmail(email);
    if (byEmail) {
      // Sambungkan google_id ke akun yang ada
      const { rows } = await pool.query(
        `UPDATE users SET google_id = $1, avatar = COALESCE($2, avatar), updated_at = NOW()
         WHERE id = $3
         RETURNING id, name, email, avatar, created_at`,
        [googleId, avatar, byEmail.id]
      );
      return rows[0];
    }

    // Buat akun baru via Google
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, google_id, avatar, password)
       VALUES ($1, $2, $3, $4, NULL)
       RETURNING id, name, email, avatar, created_at`,
      [name, email, googleId, avatar]
    );
    return rows[0];
  },

  updateName: async (userId, name) => {
    const { rows } = await pool.query(
      `UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, avatar, created_at`,
      [name, userId]
    );
    return rows[0];
  },

  updatePassword: async (userId, hashedPassword) => {
    await pool.query(
      `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
      [hashedPassword, userId]
    );
  },
};

module.exports = UserModel;
