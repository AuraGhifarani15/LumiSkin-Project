#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Waiting for PostgreSQL database to be ready..."
node -e '
const { Client } = require("pg");
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const client = new Client({ connectionString: url });
async function connect() {
  for (let i = 0; i < 30; i++) {
    try {
      await client.connect();
      console.log("Database connection successful!");
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log(`Waiting for database... attempt ${i + 1}/30`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  console.error("Could not connect to database");
  process.exit(1);
}
connect();
'

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting the application..."
exec npm start
