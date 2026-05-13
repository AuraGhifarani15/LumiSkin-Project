const pool = require("./db");

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log("Membuat tabel password_reset_tokens...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        token       VARCHAR(64)  PRIMARY KEY,
        user_id     INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at  TIMESTAMPTZ  NOT NULL,
        used        BOOLEAN      DEFAULT FALSE,
        created_at  TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_reset_tokens_user
        ON password_reset_tokens(user_id);
    `);

    console.log("✅ Tabel password_reset_tokens berhasil dibuat.");
  } catch (err) {
    console.error("❌ Migrasi gagal:", err.message);
  } finally {
    client.release();
    process.exit();
  }
};

migrate();
