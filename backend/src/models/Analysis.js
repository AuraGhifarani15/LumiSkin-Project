const pool = require("../config/db");

const AnalysisModel = {
  // Simpan hasil analisis
  create: async ({
    userId,
    imagePath,
    skinType,
    concerns,
    additionalNotes,
    result,
  }) => {
    const { rows } = await pool.query(
      `INSERT INTO analysis_history
         (user_id, image_path, skin_type, concerns, additional_notes, result)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        imagePath,
        skinType,
        concerns,
        additionalNotes,
        JSON.stringify(result),
      ],
    );
    return rows[0];
  },

  // Ambil riwayat analisis milik user tertentu
  findByUserId: async (userId) => {
    const { rows } = await pool.query(
      `SELECT id, skin_type, concerns, additional_notes, result, created_at
       FROM analysis_history
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return rows;
  },

  // Ambil satu analisis berdasarkan ID
  findById: async (id, userId) => {
    const { rows } = await pool.query(
      `SELECT * FROM analysis_history WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    return rows[0] || null;
  },
};

module.exports = AnalysisModel;
