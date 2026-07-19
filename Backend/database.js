const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function connectDB() {

    const db = await open({
        filename: "./cafe.db",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            points INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log("✅ Database Connected");

    return db;
}

module.exports = connectDB;