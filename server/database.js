const { Pool } = require('pg');
require("dotenv").config({path: '../.env'});
require('dotenv').config();

//creates a database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432,
    ssl: { rejectUnauthorized: false } // Enable SSL if required
});

//prints whether it successfully connects to the database
async function testConnection() {
    try {
        const res = await pool.query("SELECT NOW();");
        console.log("Connected to DB!", res.rows);
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

testConnection();

module.exports = pool;
