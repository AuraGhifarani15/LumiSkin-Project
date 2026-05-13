const pool = require("./db");

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log("Menjalankan migrasi Google OAuth...");

    await client.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
        ADD COLUMN IF NOT EXISTS avatar    TEXT,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    `);

    await client.query(`
      ALTER TABLE users
        ALTER COLUMN password DROP NOT NULL;
    `);

    console.log(
      "Migrasi selesai! Kolom google_id, avatar, updated_at ditambahkan.",
    );
    console.log("Kolom password sekarang nullable (untuk user Google).");
  } catch (err) {
    console.error("Migrasi gagal:", err.message);
  } finally {
    client.release();
    process.exit();
  }
};

migrate();
