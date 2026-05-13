const { Pool } = require("pg");
const logger = require("../utils/logger");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "lumiskin_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
  logger.info("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL error:", err.message);
  logger.error({ err }, "PostgreSQL connection error");
});

module.exports = pool;
