const pool = require("./db");
require("dotenv").config();

const createTables = async () => {
  const client = await pool.connect();

  try {
    console.log("Running migrations...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(150) UNIQUE NOT NULL,
        password    VARCHAR(255) NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Table: users");

    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token       VARCHAR(255) NOT NULL,
        expires_at  TIMESTAMP NOT NULL,
        used        BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Table: password_reset_tokens");

    await client.query(`
      CREATE TABLE IF NOT EXISTS analysis_history (
        id                SERIAL PRIMARY KEY,
        user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
        image_path        VARCHAR(255),
        skin_type         VARCHAR(50),
        concerns          TEXT[],
        additional_notes  TEXT,
        result            JSONB,
        created_at        TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Table: analysis_history");

    console.log("\nAll migrations completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

createTables();
