import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "warjo",
});

if (db) {
  console.log("Database connected successfully");
} else {
  console.log("Database connection failed");
}

export default db;
