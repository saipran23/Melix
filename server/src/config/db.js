import pkg from "pg";
const { Client } = pkg;

console.log("ENV PASSWORD:", process.env.PG_PASSWORD);
const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "melix",
  password: "Saipraneeth@2006",
  port: 5432,
});

db.connect();

export default db;