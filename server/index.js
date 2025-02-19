const express = require("express");
const pool = require('./database');
const app = express();

require("dotenv").config({path: '../.env'});

//i dont think this does anything
const PORT = process.env.PORT || 3000;

//ensures only receiving requests from client server via .env file
const cors = require("cors");
const corsOptions = {
    origin: [process.env.CORS_ORIGIN],
};
//applies above options
app.use(cors(corsOptions));

app.get("/api", (req, res) =>  {
    res.json({ fruits: ["apple", "orange", "meow"]});
});

/*
app.get('/player/:id', async (req, res) => {
    const patientId = req.params.id;

    try {
        const result = await pool.query(
            `SELECT fld_p_name FROM test.tbl_players WHERE fld_p_id_pk = $1`,
            [patientId]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            console.log("Running query:", `SELECT fld_p_name FROM test.tbl_players WHERE fld_p_id_pk = ${patientId}`);
            res.status(404).json({ error: "Patient not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});
*/

//uses pool to query db for the names of players from tbl_players
//function returns array of names
app.get('/players', async (req, res) => {
    const patientId = req.params.id;

    try {
        const result = await pool.query(
            "SELECT fld_p_name FROM test.tbl_players"
        );

        const playerNames = result.rows.map(row => row.fld_p_name);

        if (result.rows.length > 0) {
            res.json(playerNames);
        } else {
            console.log("Running query: SELECT fld_p_name FROM test.tbl_players");
            res.status(404).json({ error: "Player not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
